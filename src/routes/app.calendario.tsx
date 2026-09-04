import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, type CalendarEvent } from "@/lib/demo-data";
import { useApp, useEmployeeMap } from "@/lib/store";
import { EmptyState, PageHeader, Panel } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/calendario")({
  component: CalendarioPage,
});

const TIPO_STYLE: Record<CalendarEvent["tipo"], string> = {
  vacaciones: "bg-info/15 text-info",
  ausencia: "bg-warning/20 text-warning",
  reunion: "bg-primary/15 text-primary",
  evento: "bg-accent text-accent-foreground",
  evaluacion: "bg-success/15 text-success",
  importante: "bg-destructive/12 text-destructive",
};

const TIPO_DOT: Record<CalendarEvent["tipo"], string> = {
  vacaciones: "bg-info",
  ausencia: "bg-warning",
  reunion: "bg-primary",
  evento: "bg-muted-foreground",
  evaluacion: "bg-success",
  importante: "bg-destructive",
};

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
// Septiembre 2026 empieza en martes (offset 1)
const OFFSET = 1;
const TOTAL = 30;

function CalendarioPage() {
  const { events } = useApp();
  const empMap = useEmployeeMap();
  const [vista, setVista] = useState("mes");
  const [dia, setDia] = useState(4);

  const eventosDe = (d: number) =>
    events.filter((e) => e.fecha === `2026-09-${String(d).padStart(2, "0")}`);

  const semanaInicio = Math.max(1, dia - ((dia + OFFSET - 1) % 7));
  const diasSemana = Array.from({ length: 7 }, (_, i) => semanaInicio + i).filter(
    (d) => d >= 1 && d <= TOTAL,
  );

  return (
    <div className="space-y-6">
      <PageHeader titulo="Calendario" descripcion="Vacaciones, ausencias, reuniones, eventos y evaluaciones.">
        <Tabs value={vista} onValueChange={setVista}>
          <TabsList>
            <TabsTrigger value="mes">Mes</TabsTrigger>
            <TabsTrigger value="semana">Semana</TabsTrigger>
            <TabsTrigger value="dia">Día</TabsTrigger>
          </TabsList>
        </Tabs>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {(Object.keys(TIPO_DOT) as CalendarEvent["tipo"][]).map((t) => (
          <span key={t} className="inline-flex items-center gap-2 text-xs capitalize text-muted-foreground">
            <span className={cn("size-2 rounded-full", TIPO_DOT[t])} /> {t}
          </span>
        ))}
      </div>

      <Panel
        titulo={vista === "dia" ? formatDate(`2026-09-${String(dia).padStart(2, "0")}`) : "Septiembre 2026"}
        {...(vista === "semana" ? { descripcion: `Semana del ${semanaInicio} de septiembre` } : {})}
      >
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDia((d) => Math.max(1, d - (vista === "mes" ? 7 : vista === "semana" ? 7 : 1)))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDia((d) => Math.min(TOTAL, d + (vista === "dia" ? 1 : 7)))}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDia(4)}>Hoy</Button>
        </div>

        {vista === "mes" ? (
          <div className="p-3 sm:p-5">
            <div className="grid grid-cols-7 gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
              {DIAS.map((d) => <span key={d} className="px-2 py-1">{d}</span>)}
            </div>
            <div className="mt-1.5 grid grid-cols-7 gap-1.5">
              {Array.from({ length: OFFSET }, (_, i) => <span key={`o${i}`} />)}
              {Array.from({ length: TOTAL }, (_, i) => i + 1).map((d) => {
                const evs = eventosDe(d);
                return (
                  <button
                    key={d}
                    onClick={() => { setDia(d); setVista("dia"); }}
                    className={cn(
                      "min-h-24 rounded-xl border p-2 text-left transition-colors",
                      d === 4
                        ? "border-primary/40 bg-primary/5"
                        : "border-border hover:bg-muted/60",
                    )}
                  >
                    <span className={cn("text-xs font-semibold", d === 4 ? "text-primary" : "text-foreground")}>
                      {d}
                    </span>
                    <span className="mt-1.5 block space-y-1">
                      {evs.slice(0, 2).map((e) => (
                        <span
                          key={e.id}
                          className={cn(
                            "block truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                            TIPO_STYLE[e.tipo],
                          )}
                        >
                          {e.hora ? `${e.hora} ` : ""}{e.titulo}
                        </span>
                      ))}
                      {evs.length > 2 ? (
                        <span className="block px-1 text-[10px] text-muted-foreground">
                          +{evs.length - 2} más
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : vista === "semana" ? (
          <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
            {diasSemana.map((d) => {
              const evs = eventosDe(d);
              return (
                <div key={d} className="rounded-xl border border-border p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {DIAS[(d + OFFSET - 1) % 7]} {d}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {evs.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Sin eventos</p>
                    ) : (
                      evs.map((e) => (
                        <p key={e.id} className={cn("rounded-md px-2 py-1 text-xs", TIPO_STYLE[e.tipo])}>
                          {e.hora ? `${e.hora} · ` : ""}{e.titulo}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-5">
            {eventosDe(dia).length === 0 ? (
              <EmptyState
                icon={<CalendarDays className="size-5" />}
                titulo="Sin eventos este día"
                descripcion="Selecciona otro día en la vista de mes para ver su agenda."
              />
            ) : (
              <ul className="space-y-3">
                {eventosDe(dia).map((e) => (
                  <li key={e.id} className="flex items-start gap-4 rounded-xl border border-border p-4">
                    <span className="w-14 shrink-0 font-display text-sm font-semibold text-primary">
                      {e.hora ?? "Todo el día"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{e.titulo}</p>
                      <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                        {e.tipo}
                        {e.empleadoId ? ` · ${empMap.get(e.empleadoId)?.nombre}` : ""}
                      </p>
                    </div>
                    <span className={cn("ml-auto size-2.5 shrink-0 rounded-full", TIPO_DOT[e.tipo])} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
