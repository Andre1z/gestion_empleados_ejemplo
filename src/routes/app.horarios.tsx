import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarRange, Pencil } from "lucide-react";
import { toast } from "sonner";
import type { ScheduleShift } from "@/lib/demo-data";
import { useApp, useEmployeeMap } from "@/lib/store";
import { InitialsAvatar, PageHeader, Panel, StatCard } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const Route = createFileRoute("/app/horarios")({
  component: HorariosPage,
});

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const TURNO_STYLE: Record<string, string> = {
  Mañana: "bg-accent text-accent-foreground border-primary/25",
  Tarde: "bg-chart-2/12 text-chart-2 border-chart-2/25",
  Partido: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  Libre: "bg-muted text-muted-foreground border-border",
};

function HorariosPage() {
  const { schedules, updateShift } = useApp();
  const empMap = useEmployeeMap();
  const [edit, setEdit] = useState<{ empleadoId: string; dia: number; actual: ScheduleShift } | null>(
    null,
  );

  const totalHoras = schedules.reduce(
    (acc, s) => acc + s.dias.filter((d) => d.turno !== "Libre").length * 8,
    0,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Horarios"
        descripcion="Planificación semanal de turnos. Haz clic en cualquier celda para editarla."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Empleados planificados" value={schedules.length} hint="Semana del 31 ago – 6 sep" icon={<CalendarRange className="size-4" />} tone="primary" />
        <StatCard label="Horas planificadas" value={`${totalHoras} h`} hint="Total de la semana" />
        <StatCard label="Turnos distintos" value="3" hint="Mañana, tarde y partido" tone="success" />
      </div>

      <Panel titulo="Calendario semanal" descripcion="Turnos por empleado">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="sticky left-0 bg-card px-5 py-3">Empleado</th>
                {DIAS.map((d) => (
                  <th key={d} className="px-3 py-3 text-center">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {schedules.map((s) => {
                const emp = empMap.get(s.empleadoId);
                return (
                  <tr key={s.empleadoId} className="hover:bg-muted/40">
                    <td className="sticky left-0 bg-card px-5 py-3">
                      <span className="flex items-center gap-3">
                        <InitialsAvatar nombre={emp?.nombre ?? "??"} id={s.empleadoId} size="sm" />
                        <span>
                          <span className="block font-medium">{emp?.nombre}</span>
                          <span className="block text-xs text-muted-foreground">{emp?.departamento}</span>
                        </span>
                      </span>
                    </td>
                    {s.dias.map((d, i) => (
                      <td key={i} className="px-2 py-2 text-center">
                        <button
                          onClick={() => setEdit({ empleadoId: s.empleadoId, dia: i, actual: d })}
                          className={cn(
                            "group w-full rounded-lg border px-2 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]",
                            TURNO_STYLE[d.turno],
                          )}
                        >
                          <span className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider">
                            {d.turno}
                            <Pencil className="size-2.5 opacity-0 transition-opacity group-hover:opacity-70" />
                          </span>
                          <span className="mt-0.5 block font-mono text-[11px]">
                            {d.turno === "Libre" ? "—" : `${d.inicio} — ${d.fin}`}
                          </span>
                        </button>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-4 border-t border-border px-5 py-3 text-xs text-muted-foreground">
          {Object.keys(TURNO_STYLE).map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <span className={cn("size-2.5 rounded-full border", TURNO_STYLE[t])} />
              {t}
            </span>
          ))}
        </div>
      </Panel>

      <Dialog open={!!edit} onOpenChange={(v) => !v && setEdit(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar turno</DialogTitle>
            <DialogDescription>
              {edit ? `${empMap.get(edit.empleadoId)?.nombre} · ${DIAS[edit.dia]}` : ""}
            </DialogDescription>
          </DialogHeader>
          {edit ? (
            <form
              className="space-y-4"
              onSubmit={(ev) => {
                ev.preventDefault();
                const f = new FormData(ev.currentTarget as HTMLFormElement);
                const turno = String(f.get("turno")) as ScheduleShift["turno"];
                updateShift(edit.empleadoId, edit.dia, {
                  turno,
                  inicio: turno === "Libre" ? "—" : String(f.get("inicio")),
                  fin: turno === "Libre" ? "—" : String(f.get("fin")),
                });
                setEdit(null);
                toast.success("Horario actualizado");
              }}
            >
              <div className="space-y-1.5">
                <Label>Turno</Label>
                <Select name="turno" defaultValue={edit.actual.turno}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Mañana", "Tarde", "Partido", "Libre"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="inicio">Hora de inicio</Label>
                  <Input id="inicio" name="inicio" type="time" defaultValue={edit.actual.turno === "Libre" ? "08:00" : edit.actual.inicio} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fin">Hora de fin</Label>
                  <Input id="fin" name="fin" type="time" defaultValue={edit.actual.turno === "Libre" ? "17:00" : edit.actual.fin} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEdit(null)}>Cancelar</Button>
                <Button type="submit">Guardar cambios</Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
