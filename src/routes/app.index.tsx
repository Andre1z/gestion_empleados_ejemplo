import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  CheckSquare,
  Clock,
  FileText,
  Palmtree,
  Plus,
  Star,
  TriangleAlert,
  Users,
} from "lucide-react";
import {
  actividadReciente,
  asistencia7dias,
  DEPARTAMENTOS,
  horasTrabajadas,
  vacacionesPorMes,
} from "@/lib/demo-data";
import { useApp, useEmployeeMap } from "@/lib/store";
import { InitialsAvatar, LoadingRows, Panel, StatCard } from "@/components/app/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  fontSize: "12px",
  color: "var(--foreground)",
};

function Greeting() {
  const [saludo, setSaludo] = useState("Hola");
  useEffect(() => {
    const h = new Date().getHours();
    setSaludo(h < 13 ? "Buenos días" : h < 21 ? "Buenas tardes" : "Buenas noches");
  }, []);
  return <>{saludo}</>;
}

function Dashboard() {
  const { employees, vacations, tasks, evaluations, user } = useApp();
  const empMap = useEmployeeMap();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const deVacaciones = employees.filter((e) => e.estado === "vacaciones").length;
  const ausentes = employees.filter((e) => e.estado === "ausente").length;
  const presentes = employees.length - deVacaciones - ausentes;
  const pendientes = vacations.filter((v) => v.estado === "pendiente").length;

  const porDepartamento = DEPARTAMENTOS.map((d) => ({
    name: d,
    value: employees.filter((e) => e.departamento === d).length,
  }));

  const quickActions = [
    { label: "Añadir empleado", icon: Users, to: "/app/empleados" },
    { label: "Registrar ausencia", icon: TriangleAlert, to: "/app/ausencias" },
    { label: "Crear tarea", icon: CheckSquare, to: "/app/tareas" },
    { label: "Solicitar vacaciones", icon: Palmtree, to: "/app/vacaciones" },
  ] as const;

  const actIcon = {
    vacaciones: Palmtree,
    fichaje: Clock,
    documento: FileText,
    evaluacion: Star,
    ausencia: TriangleAlert,
  } as const;

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold sm:text-[28px]">
            <Greeting />, {user?.nombreCorto} 👋
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Esto es lo que está pasando en tu empresa hoy.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/empleados">
            <Plus className="size-4" /> Añadir empleado
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Empleados" value={employees.length} hint="Plantilla total" icon={<Users className="size-4" />} tone="primary" />
        <StatCard label="Presentes hoy" value={presentes} hint={`${Math.round((presentes / employees.length) * 100)}% de la plantilla`} icon={<Clock className="size-4" />} tone="success" />
        <StatCard label="Ausentes" value={ausentes} hint="Enfermedad y permisos" icon={<TriangleAlert className="size-4" />} tone="warning" />
        <StatCard label="De vacaciones" value={deVacaciones} hint="En curso" icon={<Palmtree className="size-4" />} tone="default" />
        <StatCard label="Solicitudes pendientes" value={pendientes} hint="Requieren tu aprobación" icon={<CheckSquare className="size-4" />} tone="danger" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel titulo="Asistencia de los últimos 7 días" descripcion="Presentes, ausentes y vacaciones" className="lg:col-span-2">
          <div className="h-72 p-5 pt-2">
            {loading ? (
              <LoadingRows rows={3} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={asistencia7dias} barGap={2}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="dia" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="presentes" name="Presentes" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ausentes" name="Ausentes" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="vacaciones" name="Vacaciones" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel titulo="Empleados por departamento" descripcion="Distribución de la plantilla">
          <div className="h-72 p-5 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={porDepartamento} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={3} stroke="var(--card)">
                  {porDepartamento.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel titulo="Horas trabajadas" descripcion="Total semanal de la plantilla" className="lg:col-span-2">
          <div className="h-64 p-5 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={horasTrabajadas}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="semana" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis domain={[1500, 1900]} tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="horas" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel titulo="Vacaciones utilizadas" descripcion="Días consumidos por mes">
          <div className="h-64 p-5 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vacacionesPorMes}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="dias" name="Días" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel
          titulo="Actividad reciente"
          className="lg:col-span-2"
          accion={
            <Link to="/app/comunicaciones" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Ver todo <ArrowUpRight className="size-3.5" />
            </Link>
          }
        >
          {loading ? (
            <LoadingRows />
          ) : (
            <ul className="divide-y divide-border">
              {actividadReciente.map((a) => {
                const emp = empMap.get(a.empleadoId);
                const Icon = actIcon[a.tipo];
                return (
                  <li key={a.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/50">
                    <InitialsAvatar nombre={emp?.nombre ?? "??"} id={a.empleadoId} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px]">
                        <span className="font-semibold">{emp?.nombre}</span>{" "}
                        <span className="text-muted-foreground">{a.texto}</span>
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{a.detalle}</p>
                    </div>
                    <span className="hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:flex">
                      <Icon className="size-3.5" />
                      {a.hace}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <div className="space-y-5">
          <Panel titulo="Acciones rápidas">
            <div className="grid grid-cols-2 gap-3 p-5">
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  onClick={() => navigate({ to: a.to })}
                  className="flex flex-col items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-card)]"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <a.icon className="size-4" />
                  </span>
                  <span className="text-[13px] font-medium leading-snug">{a.label}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel titulo="Pendiente de tu revisión">
            <ul className="divide-y divide-border text-[13px]">
              <li className="flex items-center justify-between px-5 py-3">
                <span className="text-muted-foreground">Solicitudes de vacaciones</span>
                <Link to="/app/vacaciones" className="font-semibold text-primary">{pendientes}</Link>
              </li>
              <li className="flex items-center justify-between px-5 py-3">
                <span className="text-muted-foreground">Evaluaciones pendientes</span>
                <Link to="/app/evaluaciones" className="font-semibold text-primary">
                  {evaluations.filter((e) => e.estado === "pendiente").length}
                </Link>
              </li>
              <li className="flex items-center justify-between px-5 py-3">
                <span className="text-muted-foreground">Tareas activas</span>
                <Link to="/app/tareas" className="font-semibold text-primary">
                  {tasks.filter((t) => t.estado !== "completada").length}
                </Link>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
