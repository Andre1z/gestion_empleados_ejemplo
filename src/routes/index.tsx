import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarRange,
  Check,
  Clock,
  FileText,
  Megaphone,
  Palmtree,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PeopleFlow — Gestiona tu equipo, simplifica tu empresa" },
      {
        name: "description",
        content:
          "Software de RRHH para pymes: empleados, fichaje, horarios, vacaciones, documentos, evaluaciones y comunicación interna en una sola plataforma.",
      },
      {
        property: "og:title",
        content: "PeopleFlow — Gestiona tu equipo, simplifica tu empresa",
      },
      {
        property: "og:description",
        content:
          "Centraliza empleados, fichajes, horarios, vacaciones y comunicación interna con PeopleFlow.",
      },
    ],
  }),
  component: Landing,
});

const MODULOS = [
  {
    icon: Users,
    titulo: "Todo tu equipo en un solo lugar",
    texto:
      "Fichas completas, organigrama por departamentos, contratos y estados en tiempo real.",
  },
  {
    icon: Clock,
    titulo: "Control horario",
    texto:
      "Fichaje con un clic, pausas, horas trabajadas e historial auditable para cada persona.",
  },
  {
    icon: Palmtree,
    titulo: "Gestión de vacaciones",
    texto: "Solicitudes, saldos por empleado y aprobaciones en dos clics sin correos.",
  },
  {
    icon: FileText,
    titulo: "Documentos",
    texto: "Contratos, nóminas y políticas internas ordenados por categoría y estado de firma.",
  },
  {
    icon: Star,
    titulo: "Evaluaciones",
    texto: "Evaluaciones por competencias con puntuación media y evolución trimestral.",
  },
  {
    icon: Megaphone,
    titulo: "Comunicación interna",
    texto: "Anuncios segmentados por departamento con notificaciones para todo el equipo.",
  },
  {
    icon: BarChart3,
    titulo: "Dashboard empresarial",
    texto: "Asistencia, absentismo, horas y vacaciones en indicadores claros para dirección.",
  },
  {
    icon: CalendarRange,
    titulo: "Horarios y turnos",
    texto: "Planifica turnos semanales y detecta solapamientos antes de publicarlos.",
  },
];

const BENEFICIOS = [
  { valor: "−12 h", label: "de trabajo administrativo al mes por responsable de RRHH" },
  { valor: "100 %", label: "de fichajes registrados y trazables según normativa" },
  { valor: "48 h", label: "tiempo medio de respuesta a solicitudes de vacaciones" },
  { valor: "1 sola", label: "fuente de verdad para todo el ciclo del empleado" },
];

const PLANES = [
  {
    nombre: "Starter",
    precio: "3 €",
    desc: "Para equipos que empiezan a ordenar su gestión de personas.",
    features: ["Hasta 20 empleados", "Fichaje y horarios", "Vacaciones y ausencias", "Soporte por email"],
  },
  {
    nombre: "Business",
    precio: "6 €",
    desc: "El plan más elegido por pymes en crecimiento.",
    destacado: true,
    features: [
      "Hasta 250 empleados",
      "Todo lo de Starter",
      "Documentos y firmas",
      "Evaluaciones y tareas",
      "Roles y permisos",
    ],
  },
  {
    nombre: "Enterprise",
    precio: "A medida",
    desc: "Para organizaciones con múltiples centros y necesidades avanzadas.",
    features: [
      "Empleados ilimitados",
      "SSO y auditoría",
      "Integraciones y API",
      "Gestor de cuenta dedicado",
    ],
  },
];

function Landing() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#producto" className="transition-colors hover:text-foreground">Producto</a>
            <a href="#beneficios" className="transition-colors hover:text-foreground">Beneficios</a>
            <a href="#precios" className="transition-colors hover:text-foreground">Precios</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Iniciar sesión</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/app">Ver demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-faint pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-20 text-center sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            Cumple el registro horario obligatorio
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] text-foreground sm:text-6xl">
            Gestiona tu equipo.
            <br />
            <span className="text-primary">Simplifica tu empresa.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            PeopleFlow centraliza empleados, horarios, vacaciones, asistencia y comunicación
            interna en una única plataforma.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/app">
                Ver demo <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setOpen(true)}>
              Solicitar información
            </Button>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="panel overflow-hidden p-2 shadow-[var(--shadow-lift)]">
              <div className="rounded-lg border border-border bg-surface">
                <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                  <span className="size-2.5 rounded-full bg-destructive/50" />
                  <span className="size-2.5 rounded-full bg-warning/60" />
                  <span className="size-2.5 rounded-full bg-success/50" />
                  <span className="ml-3 text-[11px] text-muted-foreground">
                    app.peopleflow.es/dashboard
                  </span>
                </div>
                <div className="grid gap-3 p-5 text-left sm:grid-cols-4">
                  {[
                    { l: "Empleados", v: "48" },
                    { l: "Presentes hoy", v: "42" },
                    { l: "De vacaciones", v: "3" },
                    { l: "Solicitudes", v: "7" },
                  ].map((k) => (
                    <div key={k.l} className="rounded-lg border border-border bg-card p-4">
                      <p className="text-[11px] text-muted-foreground">{k.l}</p>
                      <p className="mt-1 font-display text-2xl font-semibold">{k.v}</p>
                    </div>
                  ))}
                  <div className="sm:col-span-4 flex h-28 items-end gap-2 rounded-lg border border-border bg-card p-4">
                    {[44, 62, 51, 78, 68, 84, 72, 90, 66, 80, 58, 88].map((h, i) => (
                      <span
                        key={i}
                        className="flex-1 rounded-t bg-primary/80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="producto" className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Producto</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Un módulo para cada proceso de personas
          </h2>
          <p className="mt-3 text-muted-foreground">
            Todo conectado: lo que ocurre en un fichaje se refleja en el dashboard, en el
            calendario y en los informes de dirección.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MODULOS.map((m) => (
            <article
              key={m.titulo}
              className="panel p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                <m.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold">{m.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="beneficios" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="max-w-2xl text-3xl font-semibold sm:text-4xl">
            Menos administración, más criterio para decidir
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFICIOS.map((b) => (
              <div key={b.label} className="border-l-2 border-primary/40 pl-5">
                <p className="font-display text-3xl font-semibold text-foreground">{b.valor}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="precios" className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">Precios transparentes</h2>
          <p className="mt-3 text-muted-foreground">Por empleado y mes. Sin coste de implantación.</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANES.map((p) => (
            <div
              key={p.nombre}
              className={
                p.destacado
                  ? "relative rounded-2xl border-2 border-primary bg-card p-7 shadow-[var(--shadow-lift)]"
                  : "panel p-7"
              }
            >
              {p.destacado ? (
                <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                  Más elegido
                </span>
              ) : null}
              <h3 className="text-lg font-semibold">{p.nombre}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <p className="mt-6 font-display text-4xl font-semibold">
                {p.precio}
                {p.precio.includes("€") ? (
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    /empleado/mes
                  </span>
                ) : null}
              </p>
              <ul className="mt-6 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-7 w-full"
                variant={p.destacado ? "default" : "outline"}
                onClick={() => setOpen(true)}
              >
                {p.precio === "A medida" ? "Hablar con ventas" : "Empezar ahora"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Software de gestión de personas para pequeñas y medianas empresas.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Producto</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><a href="#producto" className="hover:text-foreground">Módulos</a></li>
              <li><a href="#precios" className="hover:text-foreground">Precios</a></li>
              <li><Link to="/app" className="hover:text-foreground">Demo interactiva</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Empresa</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><a href="#beneficios" className="hover:text-foreground">Beneficios</a></li>
              <li><button onClick={() => setOpen(true)} className="hover:text-foreground">Contacto</button></li>
              <li><Link to="/login" className="hover:text-foreground">Acceso clientes</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Legal</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Aviso legal</li>
              <li>Privacidad</li>
              <li>Cookies</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border px-5 py-6">
          <p className="mx-auto max-w-6xl text-xs text-muted-foreground">
            © 2026 PeopleFlow. Datos de demostración ficticios.
          </p>
        </div>
      </footer>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar información</DialogTitle>
            <DialogDescription>
              Te contamos cómo implantar PeopleFlow en tu empresa en menos de una semana.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              toast.success("Solicitud enviada", {
                description: "Nuestro equipo te contactará en menos de 24 horas.",
              });
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" required placeholder="Carlos García" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="empresa">Empresa</Label>
                <Input id="empresa" required placeholder="Acme S.L." />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email corporativo</Label>
              <Input id="email" type="email" required placeholder="carlos@acme.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="msg">¿Qué necesitas resolver?</Label>
              <Textarea id="msg" rows={3} placeholder="Somos 60 personas y gestionamos vacaciones en Excel…" />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">Enviar solicitud</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
