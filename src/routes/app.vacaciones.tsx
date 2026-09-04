import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Palmtree, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/demo-data";
import { useApp, useEmployeeMap } from "@/lib/store";
import {
  EmptyState,
  InitialsAvatar,
  PageHeader,
  Panel,
  StatCard,
  StatusPill,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/vacaciones")({
  component: VacacionesPage,
});

const SEPT = Array.from({ length: 30 }, (_, i) => i + 1);

function VacacionesPage() {
  const { vacations, setVacationStatus, addVacation } = useApp();
  const empMap = useEmployeeMap();
  const [open, setOpen] = useState(false);
  const [detalle, setDetalle] = useState<string | null>(null);

  const pendientes = vacations.filter((v) => v.estado === "pendiente");
  const disponibles = 18;
  const usados = 12;

  const diasOcupados = new Map<number, string[]>();
  vacations
    .filter((v) => v.estado === "aprobada" && v.desde.startsWith("2026-09"))
    .forEach((v) => {
      const ini = Number(v.desde.slice(8));
      const fin = v.hasta.startsWith("2026-09") ? Number(v.hasta.slice(8)) : 30;
      for (let d = ini; d <= fin; d++) {
        diasOcupados.set(d, [...(diasOcupados.get(d) ?? []), empMap.get(v.empleadoId)?.nombre ?? ""]);
      }
    });

  const lista = (filtro: (typeof vacations)[number]["estado"] | "todas") =>
    filtro === "todas" ? vacations : vacations.filter((v) => v.estado === filtro);

  return (
    <div className="space-y-6">
      <PageHeader titulo="Vacaciones" descripcion="Saldos, calendario y aprobación de solicitudes.">
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Solicitar vacaciones
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Días disponibles" value={disponibles} hint="Saldo de Carlos García" icon={<Palmtree className="size-4" />} tone="primary" />
        <StatCard label="Días utilizados" value={usados} hint="De 30 días anuales" tone="success" />
        <StatCard label="Solicitudes pendientes" value={pendientes.length} hint="Requieren aprobación" tone="warning" />
      </div>

      <Panel titulo="Mi saldo anual" descripcion="Consumo de vacaciones 2026">
        <div className="p-5">
          <Progress value={(usados / 30) * 100} className="h-2" />
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>{usados} días disfrutados</span>
            <span>{disponibles} días pendientes de disfrutar</span>
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel titulo="Calendario de vacaciones" descripcion="Septiembre 2026" className="lg:col-span-1">
          <div className="p-5">
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-muted-foreground">
              {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => (
                <span key={i} className="py-1">{d}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              <span className="col-span-1" />
              <span className="col-span-1" />
              {SEPT.map((d) => {
                const ocup = diasOcupados.get(d);
                return (
                  <div
                    key={d}
                    title={ocup?.join(", ")}
                    className={cn(
                      "grid aspect-square place-items-center rounded-md text-xs transition-colors",
                      ocup
                        ? "bg-primary/15 font-semibold text-primary"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Los días resaltados tienen vacaciones aprobadas.
            </p>
          </div>
        </Panel>

        <Panel titulo="Solicitudes" className="lg:col-span-2">
          <Tabs defaultValue="pendiente" className="p-5">
            <TabsList>
              <TabsTrigger value="pendiente">Pendientes ({pendientes.length})</TabsTrigger>
              <TabsTrigger value="aprobada">Aprobadas</TabsTrigger>
              <TabsTrigger value="todas">Todas</TabsTrigger>
            </TabsList>
            {(["pendiente", "aprobada", "todas"] as const).map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                {lista(tab).length === 0 ? (
                  <EmptyState
                    icon={<Palmtree className="size-5" />}
                    titulo="No hay solicitudes"
                    descripcion="Cuando alguien solicite vacaciones aparecerá aquí para su aprobación."
                  />
                ) : (
                  <ul className="divide-y divide-border">
                    {lista(tab).map((v) => {
                      const emp = empMap.get(v.empleadoId);
                      return (
                        <li key={v.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                          <InitialsAvatar nombre={emp?.nombre ?? "??"} id={v.empleadoId} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold">{emp?.nombre}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(v.desde)} → {formatDate(v.hasta)} · {v.dias} días
                            </p>
                          </div>
                          <StatusPill estado={v.estado} />
                          <div className="flex items-center gap-2">
                            {v.estado === "pendiente" ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setVacationStatus(v.id, "aprobada");
                                    toast.success("Solicitud aprobada", { description: emp?.nombre });
                                  }}
                                >
                                  <Check className="size-4" /> Aprobar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setVacationStatus(v.id, "rechazada");
                                    toast.error("Solicitud rechazada", { description: emp?.nombre });
                                  }}
                                >
                                  <X className="size-4" /> Rechazar
                                </Button>
                              </>
                            ) : null}
                            <Button size="sm" variant="ghost" onClick={() => setDetalle(v.id)}>
                              Ver detalles
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </Panel>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar vacaciones</DialogTitle>
            <DialogDescription>
              Tu responsable recibirá la solicitud para aprobarla.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              const f = new FormData(ev.currentTarget as HTMLFormElement);
              const desde = String(f.get("desde"));
              const hasta = String(f.get("hasta"));
              const dias = Math.max(
                1,
                Math.round(
                  (new Date(hasta).getTime() - new Date(desde).getTime()) / 86400000,
                ) + 1,
              );
              addVacation({
                empleadoId: "emp-2",
                desde,
                hasta,
                dias,
                estado: "pendiente",
                motivo: String(f.get("motivo") || "Vacaciones"),
              });
              setOpen(false);
              toast.success("Solicitud enviada", { description: `${dias} días solicitados.` });
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="desde">Desde</Label>
                <Input id="desde" name="desde" type="date" required defaultValue="2026-10-13" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hasta">Hasta</Label>
                <Input id="hasta" name="hasta" type="date" required defaultValue="2026-10-17" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="motivo">Motivo (opcional)</Label>
              <Textarea id="motivo" name="motivo" rows={3} placeholder="Vacaciones de otoño" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">Enviar solicitud</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!detalle} onOpenChange={(v) => !v && setDetalle(null)}>
        <DialogContent className="sm:max-w-md">
          {(() => {
            const v = vacations.find((x) => x.id === detalle);
            if (!v) return null;
            const emp = empMap.get(v.empleadoId);
            return (
              <>
                <DialogHeader>
                  <DialogTitle>Solicitud de {emp?.nombre}</DialogTitle>
                  <DialogDescription>{emp?.puesto} · {emp?.departamento}</DialogDescription>
                </DialogHeader>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Desde</dt><dd className="font-medium">{formatDate(v.desde)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Hasta</dt><dd className="font-medium">{formatDate(v.hasta)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Días laborables</dt><dd className="font-medium">{v.dias}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Estado</dt><dd><StatusPill estado={v.estado} /></dd></div>
                  <div><dt className="text-muted-foreground">Motivo</dt><dd className="mt-1 font-medium">{v.motivo}</dd></div>
                </dl>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDetalle(null)}>Cerrar</Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
