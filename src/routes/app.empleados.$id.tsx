import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Briefcase, Mail, MapPin, Phone } from "lucide-react";
import { formatDate } from "@/lib/demo-data";
import { useApp } from "@/lib/store";
import {
  EmptyState,
  InitialsAvatar,
  Panel,
  StatusPill,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/empleados/$id")({
  component: EmpleadoDetalle,
  notFoundComponent: () => (
    <EmptyState
      titulo="Empleado no encontrado"
      descripcion="La ficha que buscas no existe o ha sido eliminada."
    />
  ),
});

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function EmpleadoDetalle() {
  const { id } = Route.useParams();
  const { employees, vacations, documents, tasks, evaluations, clockHistory } = useApp();
  const emp = employees.find((e) => e.id === id);
  if (!emp) throw notFound();

  const misVac = vacations.filter((v) => v.empleadoId === id);
  const misDocs = documents.filter((d) => d.empleadoId === id);
  const misTasks = tasks.filter((t) => t.responsableId === id);
  const misEval = evaluations.filter((e) => e.empleadoId === id);
  const misFichajes = clockHistory.filter((c) => c.empleadoId === id);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/app/empleados">
          <ArrowLeft className="size-4" /> Volver a empleados
        </Link>
      </Button>

      <Panel>
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <InitialsAvatar nombre={emp.nombre} id={emp.id} size="xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold">{emp.nombre}</h1>
              <StatusPill estado={emp.estado} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {emp.puesto} · {emp.departamento}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5" />{emp.email}</span>
              <span className="inline-flex items-center gap-1.5"><Phone className="size-3.5" />{emp.telefono}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{emp.ubicacion}</span>
              <span className="inline-flex items-center gap-1.5"><Briefcase className="size-3.5" />{emp.contrato}</span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 sm:w-52">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Vacaciones</p>
            <p className="mt-1 font-display text-2xl font-semibold">
              {emp.diasVacaciones - emp.diasUsados}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                / {emp.diasVacaciones} días
              </span>
            </p>
            <Progress value={(emp.diasUsados / emp.diasVacaciones) * 100} className="mt-3 h-1.5" />
          </div>
        </div>
      </Panel>

      <Tabs defaultValue="info">
        <TabsList className="flex-wrap">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
          <TabsTrigger value="vacaciones">Vacaciones</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="tareas">Tareas</TabsTrigger>
          <TabsTrigger value="evaluaciones">Evaluaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-5">
          <Panel titulo="Datos del empleado">
            <dl className="grid gap-6 p-6 sm:grid-cols-3">
              <Info label="Nombre" value={emp.nombre} />
              <Info label="Puesto" value={emp.puesto} />
              <Info label="Departamento" value={emp.departamento} />
              <Info label="Email" value={emp.email} />
              <Info label="Teléfono" value={emp.telefono} />
              <Info label="Fecha de incorporación" value={formatDate(emp.incorporacion)} />
              <Info label="Ubicación" value={emp.ubicacion} />
              <Info label="Tipo de contrato" value={emp.contrato} />
              <Info label="Rol en PeopleFlow" value={emp.rol} />
            </dl>
          </Panel>
        </TabsContent>

        <TabsContent value="asistencia" className="mt-5">
          <Panel titulo="Historial de fichajes">
            {misFichajes.length === 0 ? (
              <EmptyState titulo="Sin fichajes registrados" descripcion="Este empleado aún no ha registrado jornadas." />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3">Fecha</th><th className="px-5 py-3">Entrada</th>
                    <th className="px-5 py-3">Salida</th><th className="px-5 py-3">Pausas</th>
                    <th className="px-5 py-3">Horas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {misFichajes.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/50">
                      <td className="px-5 py-3">{formatDate(c.fecha)}</td>
                      <td className="px-5 py-3 font-mono">{c.entrada}</td>
                      <td className="px-5 py-3 font-mono">{c.salida ?? "—"}</td>
                      <td className="px-5 py-3 text-muted-foreground">{c.pausas} min</td>
                      <td className="px-5 py-3 font-medium">{c.horas.toFixed(1)} h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="vacaciones" className="mt-5">
          <Panel titulo="Solicitudes de vacaciones">
            {misVac.length === 0 ? (
              <EmptyState titulo="Sin solicitudes" descripcion="No hay solicitudes registradas para este empleado." />
            ) : (
              <ul className="divide-y divide-border">
                {misVac.map((v) => (
                  <li key={v.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium">
                        {formatDate(v.desde)} → {formatDate(v.hasta)}
                      </p>
                      <p className="text-xs text-muted-foreground">{v.dias} días · {v.motivo}</p>
                    </div>
                    <StatusPill estado={v.estado} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="documentos" className="mt-5">
          <Panel titulo="Documentos">
            {misDocs.length === 0 ? (
              <EmptyState titulo="Sin documentos" descripcion="Sube contratos o nóminas desde el gestor documental." />
            ) : (
              <ul className="divide-y divide-border">
                {misDocs.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{d.nombre}</p>
                      <p className="text-xs text-muted-foreground">{d.categoria} · {formatDate(d.fecha)}</p>
                    </div>
                    <StatusPill estado={d.estado} label={d.estado} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="tareas" className="mt-5">
          <Panel titulo="Tareas asignadas">
            {misTasks.length === 0 ? (
              <EmptyState titulo="Sin tareas asignadas" descripcion="Crea una tarea desde el tablero de tareas." />
            ) : (
              <ul className="divide-y divide-border">
                {misTasks.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium">{t.titulo}</p>
                      <p className="text-xs text-muted-foreground">Límite {formatDate(t.limite)}</p>
                    </div>
                    <StatusPill estado={t.estado} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="evaluaciones" className="mt-5">
          <Panel titulo="Evaluaciones">
            {misEval.length === 0 ? (
              <EmptyState titulo="Sin evaluaciones" descripcion="Programa una evaluación desde el módulo de evaluaciones." />
            ) : (
              <ul className="divide-y divide-border">
                {misEval.map((e) => {
                  const media =
                    (e.productividad + e.equipo + e.comunicacion + e.responsabilidad + e.objetivos) / 5;
                  return (
                    <li key={e.id} className="flex items-center justify-between px-5 py-3.5">
                      <div>
                        <p className="text-sm font-medium">Evaluación {e.periodo}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(e.fecha)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {e.estado === "completada" ? (
                          <span className="font-display text-lg font-semibold">
                            {media.toFixed(1)}
                            <span className="text-xs font-normal text-muted-foreground">/10</span>
                          </span>
                        ) : null}
                        <StatusPill estado={e.estado} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
