import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatDate, type Task } from "@/lib/demo-data";
import { useApp, useEmployeeMap } from "@/lib/store";
import { InitialsAvatar, PageHeader, StatCard, StatusPill } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/tareas")({
  component: TareasPage,
});

const COLUMNAS: { key: Task["estado"]; titulo: string; punto: string }[] = [
  { key: "pendiente", titulo: "Pendientes", punto: "bg-warning" },
  { key: "progreso", titulo: "En progreso", punto: "bg-info" },
  { key: "completada", titulo: "Completadas", punto: "bg-success" },
];

const ORDEN: Task["estado"][] = ["pendiente", "progreso", "completada"];

function TareasPage() {
  const { tasks, moveTask, addTask, employees } = useApp();
  const empMap = useEmployeeMap();
  const [open, setOpen] = useState(false);
  const [responsable, setResponsable] = useState("emp-3");
  const [prioridad, setPrioridad] = useState<Task["prioridad"]>("media");
  const [detalle, setDetalle] = useState<Task | null>(null);

  const mover = (t: Task, dir: -1 | 1) => {
    const idx = ORDEN.indexOf(t.estado) + dir;
    if (idx < 0 || idx > 2) return;
    moveTask(t.id, ORDEN[idx]!);
    toast.success("Tarea actualizada", {
      description: `${t.titulo} → ${COLUMNAS[idx]!.titulo}`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader titulo="Tareas" descripcion="Tablero Kanban del equipo de Recursos Humanos.">
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Nueva tarea
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        {COLUMNAS.map((c) => (
          <StatCard
            key={c.key}
            label={c.titulo}
            value={tasks.filter((t) => t.estado === c.key).length}
            hint={c.key === "completada" ? "Cerradas este trimestre" : "En el tablero"}
            tone={c.key === "completada" ? "success" : c.key === "pendiente" ? "warning" : "primary"}
          />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {COLUMNAS.map((col, colIdx) => {
          const items = tasks.filter((t) => t.estado === col.key);
          return (
            <section key={col.key} className="flex flex-col rounded-2xl border border-border bg-surface p-4">
              <header className="flex items-center gap-2 px-1 pb-3">
                <span className={cn("size-2 rounded-full", col.punto)} />
                <h2 className="text-sm font-semibold">{col.titulo}</h2>
                <span className="ml-auto rounded-full bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {items.length}
                </span>
              </header>
              <div className="flex-1 space-y-3">
                {items.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-xs text-muted-foreground">
                    Sin tareas en esta columna
                  </p>
                ) : (
                  items.map((t) => {
                    const emp = empMap.get(t.responsableId);
                    const vencida = t.limite < "2026-09-04" && t.estado !== "completada";
                    return (
                      <article
                        key={t.id}
                        className="panel cursor-pointer p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                        onClick={() => setDetalle(t)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold leading-snug">{t.titulo}</h3>
                          <StatusPill
                            estado={t.prioridad === "baja" ? "baja_prio" : t.prioridad}
                            label={t.prioridad}
                          />
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{t.descripcion}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <InitialsAvatar nombre={emp?.nombre ?? "??"} id={t.responsableId} size="sm" />
                          <span className="truncate text-xs text-muted-foreground">{emp?.nombre}</span>
                          <span
                            className={cn(
                              "ml-auto inline-flex items-center gap-1 text-xs",
                              vencida ? "font-medium text-destructive" : "text-muted-foreground",
                            )}
                          >
                            <CalendarDays className="size-3.5" />
                            {formatDate(t.limite)}
                          </span>
                        </div>
                        <div className="mt-3 flex gap-1.5 border-t border-border pt-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={colIdx === 0}
                            onClick={(e) => { e.stopPropagation(); mover(t, -1); }}
                          >
                            <ArrowLeft className="size-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="ml-auto"
                            disabled={colIdx === 2}
                            onClick={(e) => { e.stopPropagation(); mover(t, 1); }}
                          >
                            Mover <ArrowRight className="size-3.5" />
                          </Button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva tarea</DialogTitle>
            <DialogDescription>Se añadirá a la columna «Pendientes».</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              const f = new FormData(ev.currentTarget as HTMLFormElement);
              addTask({
                titulo: String(f.get("titulo")),
                descripcion: String(f.get("descripcion") || "—"),
                responsableId: responsable,
                prioridad,
                limite: String(f.get("limite")),
                estado: "pendiente",
              });
              setOpen(false);
              toast.success("Tarea creada", { description: String(f.get("titulo")) });
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" name="titulo" required placeholder="Revisar altas de septiembre" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" name="descripcion" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Responsable</Label>
                <Select value={responsable} onValueChange={setResponsable}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-64">
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Prioridad</Label>
                <Select value={prioridad} onValueChange={(v) => setPrioridad(v as Task["prioridad"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="limite">Fecha límite</Label>
              <Input id="limite" name="limite" type="date" required defaultValue="2026-09-19" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">Crear tarea</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!detalle} onOpenChange={(v) => !v && setDetalle(null)}>
        <DialogContent className="sm:max-w-md">
          {detalle ? (
            <>
              <DialogHeader>
                <DialogTitle>{detalle.titulo}</DialogTitle>
                <DialogDescription>{detalle.descripcion}</DialogDescription>
              </DialogHeader>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Responsable</dt>
                  <dd className="font-medium">{empMap.get(detalle.responsableId)?.nombre}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Prioridad</dt>
                  <dd><StatusPill estado={detalle.prioridad === "baja" ? "baja_prio" : detalle.prioridad} label={detalle.prioridad} /></dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Fecha límite</dt>
                  <dd className="font-medium">{formatDate(detalle.limite)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Estado</dt>
                  <dd><StatusPill estado={detalle.estado} /></dd>
                </div>
              </dl>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetalle(null)}>Cerrar</Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
