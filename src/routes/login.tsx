import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acceder a PeopleFlow" },
      {
        name: "description",
        content: "Inicia sesión en PeopleFlow para gestionar tu equipo, fichajes y vacaciones.",
      },
      { property: "og:title", content: "Acceder a PeopleFlow" },
      {
        property: "og:description",
        content: "Accede a tu espacio de trabajo de recursos humanos.",
      },
    ],
  }),
  component: LoginPage,
});

const DEMO_EMAIL = "admin@peopleflow.es";
const DEMO_PASS = "peopleflow";

function LoginPage() {
  const { login, user, hydrated } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && user) navigate({ to: "/app", replace: true });
  }, [hydrated, user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASS) {
        login(email.trim().toLowerCase());
        toast.success("Bienvenido de nuevo, Carlos");
        navigate({ to: "/app", replace: true });
      } else {
        setLoading(false);
        setError("Credenciales incorrectas. Usa las credenciales de demostración.");
      }
    }, 700);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-14 sm:px-14">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
          <h1 className="mt-10 text-2xl font-semibold">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Accede a tu espacio de trabajo de PeopleFlow.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {error ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Accediendo…
                </>
              ) : (
                <>
                  Iniciar sesión <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-4">
            <p className="text-xs font-semibold text-foreground">Credenciales de demostración</p>
            <p className="mt-1.5 font-mono text-xs text-muted-foreground">{DEMO_EMAIL}</p>
            <p className="font-mono text-xs text-muted-foreground">{DEMO_PASS}</p>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/" className="font-medium text-primary hover:underline">
              Solicita una demo
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden border-l border-border bg-surface lg:block">
        <div className="grid-faint pointer-events-none absolute inset-0" />
        <div className="relative flex h-full flex-col justify-center px-14">
          <blockquote className="max-w-md">
            <p className="font-display text-2xl font-semibold leading-snug text-foreground">
              “Pasamos de cuatro hojas de cálculo a un único panel. Ahora dirección ve la
              plantilla en tiempo real.”
            </p>
            <footer className="mt-6 text-sm text-muted-foreground">
              Dirección de Personas · Empresa de 120 empleados
            </footer>
          </blockquote>
          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6">
            {[
              ["48", "empleados en la demo"],
              ["11", "módulos operativos"],
              ["3", "roles de acceso"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-semibold">{v}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
