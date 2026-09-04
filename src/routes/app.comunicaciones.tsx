import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Megaphone, Pin, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/demo-data";
import { useApp, useEmployeeMap } from "@/lib/store";
import { EmptyState, InitialsAvatar, PageHeader, Panel, StatCard } from "@/components/app/ui";
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

export const Route = createFileRoute("/app/comunicaciones")({
  component: ComunicacionesPage,
});

const DESTINATARIOS = [
  "Toda la empresa",
  "Marketing",
  "Ventas",
  "Recursos Humanos",
  "IT",
  "Operaciones",
  "Managers",
];

function ComunicacionesPage() {
  const { announcements, addAnnouncement } = useApp();
  const empMap = useEmployeeMap();
  const [open, setOpen] = useState(false);
  const [dest, setDest] = useState("Toda la empresa");

  const fijados = announcements.filter((a) => a.fijado);
  const resto = announcements.filter((a) => !a.fijado);

  const card = (a: (typeof announcements)[number]) => {
    const autor = empMap.get(a.autorId);
    return (
      <article
        key={a.id}
        className="panel p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
      >
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
            <Megaphone className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <h3 className="text-sm font-semibold leading-snug">{a.titulo}</h3>
              {a.fijado ? <Pin className="size-3.5 shrink-0 text-primary" /> : null}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.mensaje}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <InitialsAvatar nombre={autor?.nombre ?? "??"} id={a.autorId} size="sm" />
                {autor?.nombre}
              </span>
              <span>{formatDate(a.fecha)}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 font-medium">{a.destinatarios}</span>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader titulo="Comunicaciones" descripcion="Anuncios internos y comunicados a los equipos.">
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Crear anuncio
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Comunicaciones" value={announcements.length} hint="Publicadas" icon={<Megaphone className="size-4" />} tone="primary" />
        <StatCard label="Fijadas" value={fijados.length} hint="Destacadas en el portal" tone="warning" />
        <StatCard label="Alcance" value="48" hint="Empleados con acceso" tone="success" />
      </div>

      {fijados.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fijadas</h2>
          <div className={cn("grid gap-4", fijados.length > 1 && "lg:grid-cols-2")}>
            {fijados.map(card)}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Historial</h2>
        {resto.length === 0 ? (
          <Panel>
            <EmptyState
              icon={<Megaphone className="size-5" />}
              titulo="Sin comunicaciones"
              descripcion="Crea el primer anuncio para informar a tu equipo."
            >
              <Button size="sm" onClick={() => setOpen(true)}>
                <Plus className="size-4" /> Crear anuncio
              </Button>
            </EmptyState>
          </Panel>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">{resto.map(card)}</div>
        )}
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear anuncio</DialogTitle>
            <DialogDescription>
              Se publicará en el portal y generará una notificación a los destinatarios.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              const f = new FormData(ev.currentTarget as HTMLFormElement);
              addAnnouncement({
                titulo: String(f.get("titulo")),
                mensaje: String(f.get("mensaje")),
                autorId: "emp-2",
                fecha: "2026-09-04",
                destinatarios: dest,
                fijado: false,
              });
              setOpen(false);
              toast.success("Anuncio publicado", { description: dest });
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" name="titulo" required placeholder="Cambio de horario de verano" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mensaje">Mensaje</Label>
              <Textarea id="mensaje" name="mensaje" rows={5} required placeholder="Escribe el comunicado…" />
            </div>
            <div className="space-y-1.5">
              <Label>Destinatarios</Label>
              <Select value={dest} onValueChange={setDest}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DESTINATARIOS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">Publicar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
