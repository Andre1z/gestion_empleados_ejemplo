import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatDate, type Absence } from "@/lib/demo-data";
import { useApp, useEmployeeMap } from "@/lib/store";
import {
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

export const Route = createFileRoute("/app/ausencias")({
  component: AusenciasPage,
});

const TIPOS: Absence["tipo"][] = [
  "Enfermedad",
  "Asuntos personales",
  "Permiso",
  "No justificada",
  "Otro",
];

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function AusenciasPage() {
  const { absences, addAbsence, employees } = useApp();
  const empMap = useEmployeeMap();
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<Absence["tipo"]>("Enfermedad");
  const [empleado, setEmpleado] = useState("emp-1");

  const totalDias = absences.reduce((a, b) => a + b.dias, 0);
  const noJustificadas = absences.filter((a) => !a.justificada).length;
  const tasa = ((totalDias / (employees.length * 22)) * 100).toFixed(1);

  const porTipo = TIPOS.map((t) => ({
    name: t,
    value: absences.filter((a) => a.tipo === t).length,
  })).filter((d) => d.value > 0);

  const diasSept = new Set(
    absences.filter((a) => a.fecha.startsWith("2026-09")).map((a) => Number(a.fecha.slice(8))),
  );

  return (
    <div className="space-y-6">
      <PageHeader titulo="Ausencias" descripcion="Control de absentismo por tipo, empleado y periodo.">
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Registrar ausencia
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ausencias registradas" value={absences.length} hint="Últimos 30 días" icon={<TriangleAlert className="size-4" />} tone="warning" />
        <StatCard label="Días perdidos" value={totalDias} hint="Total acumulado" />
        <StatCard label="No justificadas" value={noJustificadas} hint="Requieren seguimiento" tone="danger" />
        <StatCard label="Tasa de absentismo" value={`${tasa}%`} hint="Sobre jornadas teóricas" tone="success" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel titulo="Distribución por tipo" className="lg:col-span-1">
          <div className="h-64 p-5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={porTipo} dataKey="value" nameKey="name" outerRadius={80} stroke="var(--card)">
                  {porTipo.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-2 border-t border-border p-5 text-xs">
            {porTipo.map((t, i) => (
              <li key={t.name} className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {t.name}
                </span>
                <span className="font-semibold">{t.value}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel titulo="Calendario de ausencias" descripcion="Septiembre 2026" className="lg:col-span-2">
          <div className="p-5">
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] uppercase text-muted-foreground">
              {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => <span key={i}>{d}</span>)}
            </div>
            <div className="mt-1.5 grid grid-cols-7 gap-1.5">
              <span /><span />
              {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                <div
                  key={d}
                  className={cn(
                    "grid aspect-square place-items-center rounded-md text-xs transition-colors",
                    diasSept.has(d)
                      ? "bg-warning/25 font-semibold text-warning"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <Panel titulo="Registro de ausencias">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Empleado</th><th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Fecha</th><th className="px-5 py-3">Días</th>
                <th className="px-5 py-3">Justificación</th><th className="px-5 py-3">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {absences.map((a) => {
                const emp = empMap.get(a.empleadoId);
                return (
                  <tr key={a.id} className="hover:bg-muted/50">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-3">
                        <InitialsAvatar nombre={emp?.nombre ?? "??"} id={a.empleadoId} size="sm" />
                        <span className="font-medium">{emp?.nombre}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{a.tipo}</td>
                    <td className="px-5 py-3">{formatDate(a.fecha)}</td>
                    <td className="px-5 py-3">{a.dias}</td>
                    <td className="px-5 py-3">
                      <StatusPill
                        estado={a.justificada ? "aprobada" : "rechazada"}
                        label={a.justificada ? "Justificada" : "Sin justificar"}
                      />
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{a.nota}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar ausencia</DialogTitle>
            <DialogDescription>
              Queda registrada en el historial del empleado y en el calendario.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              const f = new FormData(ev.currentTarget as HTMLFormElement);
              addAbsence({
                empleadoId: empleado,
                tipo,
                fecha: String(f.get("fecha")),
                dias: Number(f.get("dias")),
                justificada: tipo !== "No justificada",
                nota: String(f.get("nota") || "—"),
              });
              setOpen(false);
              toast.success("Ausencia registrada", { description: empMap.get(empleado)?.nombre });
            }}
          >
            <div className="space-y-1.5">
              <Label>Empleado</Label>
              <Select value={empleado} onValueChange={setEmpleado}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-64">
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tipo de ausencia</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as Absence["tipo"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fecha">Fecha de inicio</Label>
                <Input id="fecha" name="fecha" type="date" required defaultValue="2026-09-04" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dias">Días</Label>
                <Input id="dias" name="dias" type="number" min={1} defaultValue={1} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nota">Nota interna</Label>
              <Textarea id="nota" name="nota" rows={2} placeholder="Parte médico entregado" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">Registrar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
