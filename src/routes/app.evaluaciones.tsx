import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { evolucionEvaluaciones, formatDate, type Evaluation } from "@/lib/demo-data";
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
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/evaluaciones")({
  component: EvaluacionesPage,
});

const CRITERIOS = [
  { key: "productividad", label: "Productividad" },
  { key: "equipo", label: "Trabajo en equipo" },
  { key: "comunicacion", label: "Comunicación" },
  { key: "responsabilidad", label: "Responsabilidad" },
  { key: "objetivos", label: "Objetivos" },
] as const;

const media = (e: Evaluation) =>
  (e.productividad + e.equipo + e.comunicacion + e.responsabilidad + e.objetivos) / 5;

function EvaluacionesPage() {
  const { evaluations, saveEvaluation } = useApp();
  const empMap = useEmployeeMap();
  const [activa, setActiva] = useState<Evaluation | null>(null);
  const [valores, setValores] = useState<Record<string, number>>({});
  const [comentarios, setComentarios] = useState("");

  const completadas = evaluations.filter((e) => e.estado === "completada");
  const pendientes = evaluations.filter((e) => e.estado === "pendiente");
  const programadas = evaluations.filter((e) => e.estado === "programada");
  const mediaGlobal = completadas.length
    ? (completadas.reduce((a, e) => a + media(e), 0) / completadas.length).toFixed(1)
    : "—";

  const abrir = (e: Evaluation) => {
    setActiva(e);
    setValores(
      Object.fromEntries(
        CRITERIOS.map((c) => [c.key, e[c.key] > 0 ? e[c.key] : 8]),
      ),
    );
    setComentarios(e.comentarios);
  };

  const radarData = (e: Evaluation) =>
    CRITERIOS.map((c) => ({ criterio: c.label, valor: e[c.key] }));

  const listado = (items: Evaluation[]) =>
    items.length === 0 ? (
      <EmptyState
        icon={<Star className="size-5" />}
        titulo="No hay evaluaciones aquí"
        descripcion="Las evaluaciones aparecerán en esta pestaña según su estado."
      />
    ) : (
      <ul className="divide-y divide-border">
        {items.map((e) => {
          const emp = empMap.get(e.empleadoId);
          const m = media(e);
          return (
            <li key={e.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <InitialsAvatar nombre={emp?.nombre ?? "??"} id={e.empleadoId} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{emp?.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {e.periodo} · {formatDate(e.fecha)} · {emp?.departamento}
                </p>
              </div>
              {e.estado === "completada" ? (
                <span className="font-display text-lg font-semibold text-primary">
                  {m.toFixed(1)}<span className="text-xs text-muted-foreground">/10</span>
                </span>
              ) : null}
              <StatusPill estado={e.estado} />
              <Button size="sm" variant={e.estado === "completada" ? "outline" : "default"} onClick={() => abrir(e)}>
                {e.estado === "completada" ? "Ver evaluación" : "Evaluar"}
              </Button>
            </li>
          );
        })}
      </ul>
    );

  return (
    <div className="space-y-6">
      <PageHeader titulo="Evaluaciones" descripcion="Desempeño por criterios, evolución histórica y feedback." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pendientes" value={pendientes.length} hint="Por completar este mes" icon={<Star className="size-4" />} tone="warning" />
        <StatCard label="Completadas" value={completadas.length} hint="Histórico registrado" tone="success" />
        <StatCard label="Próximas" value={programadas.length} hint="Programadas en calendario" tone="primary" />
        <StatCard label="Media global" value={`${mediaGlobal}/10`} hint="Todas las evaluaciones cerradas" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel titulo="Evolución de la media" descripcion="Últimos 5 trimestres" className="lg:col-span-2">
          <div className="h-72 p-5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucionEvaluaciones}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="periodo" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis domain={[6, 10]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />
                <Line type="monotone" dataKey="media" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel titulo="Última evaluación" descripcion={empMap.get(completadas[0]?.empleadoId ?? "")?.nombre ?? "Sin datos"}>
          <div className="h-72 p-5">
            {completadas[0] ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData(completadas[0])}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="criterio" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <Radar dataKey="valor" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </Panel>
      </div>

      <Panel titulo="Listado de evaluaciones">
        <Tabs defaultValue="pendiente" className="p-5">
          <TabsList>
            <TabsTrigger value="pendiente">Pendientes ({pendientes.length})</TabsTrigger>
            <TabsTrigger value="completada">Completadas ({completadas.length})</TabsTrigger>
            <TabsTrigger value="programada">Próximas ({programadas.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pendiente" className="mt-4">{listado(pendientes)}</TabsContent>
          <TabsContent value="completada" className="mt-4">{listado(completadas)}</TabsContent>
          <TabsContent value="programada" className="mt-4">{listado(programadas)}</TabsContent>
        </Tabs>
      </Panel>

      <Dialog open={!!activa} onOpenChange={(v) => !v && setActiva(null)}>
        <DialogContent className="sm:max-w-lg">
          {activa ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {empMap.get(activa.empleadoId)?.nombre} — {activa.periodo}
                </DialogTitle>
                <DialogDescription>
                  Puntúa cada criterio de 0 a 10 y añade comentarios de desarrollo.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5">
                {CRITERIOS.map((c) => (
                  <div key={c.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>{c.label}</Label>
                      <span className="font-display text-sm font-semibold text-primary">
                        {(valores[c.key] ?? 0).toFixed(1)}
                      </span>
                    </div>
                    <Slider
                      value={[valores[c.key] ?? 0]}
                      min={0}
                      max={10}
                      step={0.1}
                      onValueChange={([v]) => setValores((p) => ({ ...p, [c.key]: v ?? 0 }))}
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <Label htmlFor="comentarios">Comentarios</Label>
                  <Textarea
                    id="comentarios"
                    rows={3}
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    placeholder="Fortalezas, áreas de mejora y objetivos para el próximo trimestre…"
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl bg-surface p-4">
                  <span className="text-sm text-muted-foreground">Puntuación general</span>
                  <span className="font-display text-2xl font-semibold text-primary">
                    {(
                      CRITERIOS.reduce((a, c) => a + (valores[c.key] ?? 0), 0) / CRITERIOS.length
                    ).toFixed(1)}
                    <span className="text-sm text-muted-foreground">/10</span>
                  </span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActiva(null)}>Cancelar</Button>
                <Button
                  onClick={() => {
                    saveEvaluation(activa.id, {
                      productividad: valores["productividad"] ?? 0,
                      equipo: valores["equipo"] ?? 0,
                      comunicacion: valores["comunicacion"] ?? 0,
                      responsabilidad: valores["responsabilidad"] ?? 0,
                      objetivos: valores["objetivos"] ?? 0,
                      comentarios,
                      estado: "completada",
                    });
                    setActiva(null);
                    toast.success("Evaluación guardada", {
                      description: empMap.get(activa.empleadoId)?.nombre,
                    });
                  }}
                >
                  Guardar evaluación
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
