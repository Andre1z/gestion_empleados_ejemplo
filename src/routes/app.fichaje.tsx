import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Coffee, LogIn, LogOut, Timer } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/demo-data";
import { useApp, useEmployeeMap } from "@/lib/store";
import {
  InitialsAvatar,
  PageHeader,
  Panel,
  StatCard,
  StatusPill,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/fichaje")({
  component: FichajePage,
});

function Reloj() {
  const [hora, setHora] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setHora(new Date().toLocaleTimeString("es-ES"));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="font-mono">{hora}</span>;
}

function FichajePage() {
  const {
    clockedIn,
    clockInAt,
    clockOutAt,
    breakMinutes,
    toggleClock,
    addBreak,
    clockHistory,
    employees,
  } = useApp();
  const empMap = useEmployeeMap();

  const horas = clockInAt
    ? (() => {
        const [h, m] = clockInAt.split(":").map(Number);
        const start = (h ?? 0) * 60 + (m ?? 0);
        const end = clockOutAt
          ? (() => {
              const [h2, m2] = clockOutAt.split(":").map(Number);
              return (h2 ?? 0) * 60 + (m2 ?? 0);
            })()
          : start + 480;
        return Math.max(0, (end - start - breakMinutes) / 60);
      })()
    : 0;

  const salidaPrevista = clockInAt
    ? (() => {
        const [h, m] = clockInAt.split(":").map(Number);
        const total = (h ?? 0) * 60 + (m ?? 0) + 515 + breakMinutes;
        return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
      })()
    : "17:32";

  return (
    <div className="space-y-6">
      <PageHeader titulo="Fichaje" descripcion="Registro horario de tu jornada y de toda la plantilla.">
        <span className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
          <Reloj />
        </span>
      </PageHeader>

      <Tabs defaultValue="mi-jornada">
        <TabsList>
          <TabsTrigger value="mi-jornada">Mi jornada</TabsTrigger>
          <TabsTrigger value="equipo">Vista de administrador</TabsTrigger>
        </TabsList>

        <TabsContent value="mi-jornada" className="mt-5 space-y-5">
          <div className="grid gap-5 lg:grid-cols-3">
            <Panel className="lg:col-span-2">
              <div className="flex flex-col items-center gap-6 p-8">
                <div className="grid w-full gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-surface p-5 text-center">
                    <p className="font-display text-4xl font-semibold">{clockInAt ?? "08:57"}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Entrada</p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-5 text-center">
                    <p className="font-display text-4xl font-semibold">{clockOutAt ?? salidaPrevista}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                      {clockOutAt ? "Salida" : "Salida prevista"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    toggleClock();
                    toast.success(clockedIn ? "Salida registrada" : "Entrada registrada", {
                      description: clockedIn
                        ? "Jornada cerrada correctamente."
                        : "Que tengas un buen día de trabajo.",
                    });
                  }}
                  className={cn(
                    "group relative flex w-full max-w-sm items-center justify-center gap-3 rounded-2xl px-8 py-6 font-display text-lg font-semibold tracking-tight transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]",
                    clockedIn
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {clockedIn ? <LogOut className="size-5" /> : <LogIn className="size-5" />}
                  {clockedIn ? "FICHAR SALIDA" : "FICHAR ENTRADA"}
                </button>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!clockedIn}
                    onClick={() => {
                      addBreak(15);
                      toast.info("Pausa de 15 minutos registrada");
                    }}
                  >
                    <Coffee className="size-4" /> Registrar pausa (15 min)
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {clockedIn ? "Jornada en curso" : "Fuera de jornada"}
                  </span>
                </div>
              </div>
            </Panel>

            <div className="grid gap-4">
              <StatCard label="Horas trabajadas hoy" value={`${horas.toFixed(1)} h`} hint="Objetivo 8 h" icon={<Timer className="size-4" />} tone="primary" />
              <StatCard label="Pausas acumuladas" value={`${breakMinutes} min`} hint="Descansos registrados" icon={<Coffee className="size-4" />} />
              <StatCard label="Horas esta semana" value="34,5 h" hint="Sobre 40 h de convenio" tone="success" />
            </div>
          </div>

          <Panel titulo="Historial de mis fichajes">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3">Fecha</th><th className="px-5 py-3">Entrada</th>
                  <th className="px-5 py-3">Salida</th><th className="px-5 py-3">Pausas</th>
                  <th className="px-5 py-3">Horas</th><th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clockHistory
                  .filter((c) => c.empleadoId === "emp-2")
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-muted/50">
                      <td className="px-5 py-3">{formatDate(c.fecha)}</td>
                      <td className="px-5 py-3 font-mono">{c.entrada}</td>
                      <td className="px-5 py-3 font-mono">{c.salida ?? "—"}</td>
                      <td className="px-5 py-3 text-muted-foreground">{c.pausas} min</td>
                      <td className="px-5 py-3 font-medium">{c.horas.toFixed(1)} h</td>
                      <td className="px-5 py-3"><StatusPill estado="completada" label="Cerrado" /></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Panel>
        </TabsContent>

        <TabsContent value="equipo" className="mt-5">
          <Panel titulo="Fichajes de la plantilla" descripcion="Consulta en tiempo real del estado de cada empleado">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3">Empleado</th><th className="px-5 py-3">Departamento</th>
                    <th className="px-5 py-3">Entrada</th><th className="px-5 py-3">Salida</th>
                    <th className="px-5 py-3">Horas</th><th className="px-5 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clockHistory
                    .filter((c) => c.fecha === "2026-09-03")
                    .map((c) => {
                      const emp = empMap.get(c.empleadoId);
                      return (
                        <tr key={c.id} className="hover:bg-muted/50">
                          <td className="px-5 py-3">
                            <span className="flex items-center gap-3">
                              <InitialsAvatar nombre={emp?.nombre ?? "??"} id={c.empleadoId} size="sm" />
                              <span className="font-medium">{emp?.nombre}</span>
                            </span>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">{emp?.departamento}</td>
                          <td className="px-5 py-3 font-mono">{c.entrada}</td>
                          <td className="px-5 py-3 font-mono">{c.salida ?? "—"}</td>
                          <td className="px-5 py-3 font-medium">{c.horas.toFixed(1)} h</td>
                          <td className="px-5 py-3">
                            <StatusPill estado={emp?.estado ?? "activo"} />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
              {employees.length} empleados con registro horario activo
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
