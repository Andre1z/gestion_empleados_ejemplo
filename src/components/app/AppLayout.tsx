import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  CalendarRange,
  CheckSquare,
  Clock,
  FileText,
  LayoutGrid,
  LogOut,
  Megaphone,
  Menu,
  Moon,
  Palmtree,
  Search,
  Settings,
  Star,
  Sun,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { InitialsAvatar } from "./ui";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutGrid, exact: true },
  { to: "/app/empleados", label: "Empleados", icon: Users },
  { to: "/app/fichaje", label: "Fichaje", icon: Clock },
  { to: "/app/horarios", label: "Horarios", icon: CalendarRange },
  { to: "/app/vacaciones", label: "Vacaciones", icon: Palmtree },
  { to: "/app/ausencias", label: "Ausencias", icon: TriangleAlert },
  { to: "/app/documentos", label: "Documentos", icon: FileText },
  { to: "/app/tareas", label: "Tareas", icon: CheckSquare },
  { to: "/app/evaluaciones", label: "Evaluaciones", icon: Star },
  { to: "/app/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/app/comunicaciones", label: "Comunicaciones", icon: Megaphone },
] as const;

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M5 19V7.5A2.5 2.5 0 0 1 7.5 5H12" />
          <path d="M9 12h5.5" />
          <circle cx="17.5" cy="12" r="2.5" />
        </svg>
      </span>
      {!compact ? (
        <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
          PeopleFlow
        </span>
      ) : null}
    </span>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Espacio de trabajo
      </p>
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            isActive(item.to, "exact" in item ? item.exact : false)
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <item.icon className="size-4 shrink-0 opacity-80 transition-transform group-hover:scale-110" />
          {item.label}
        </Link>
      ))}

      <div className="mt-5 border-t border-sidebar-border pt-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Gestión
        </p>
        <Link
          to="/app/configuracion"
          onClick={onNavigate}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            isActive("/app/configuracion")
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <Settings className="size-4 shrink-0 opacity-80 transition-transform group-hover:rotate-45" />
          Configuración
        </Link>
      </div>
    </nav>
  );
}

function NotificationsBell() {
  const { notifications, markNotificationsRead } = useApp();
  const sinLeer = notifications.filter((n) => !n.leida).length;
  const icons = {
    vacaciones: Palmtree,
    documento: FileText,
    evaluacion: Star,
    comunicacion: Megaphone,
  } as const;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Notificaciones"
        >
          <Bell className="size-4" />
          {sinLeer > 0 ? (
            <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              {sinLeer}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notificaciones</p>
          <button
            onClick={markNotificationsRead}
            className="text-xs font-medium text-primary hover:underline"
          >
            Marcar leídas
          </button>
        </div>
        <ul className="max-h-80 divide-y divide-border overflow-y-auto">
          {notifications.map((n) => {
            const Icon = icons[n.icono];
            return (
              <li
                key={n.id}
                className={cn(
                  "flex gap-3 px-4 py-3 transition-colors hover:bg-muted/60",
                  !n.leida && "bg-accent/40",
                )}
              >
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{n.titulo}</p>
                  <p className="truncate text-xs text-muted-foreground">{n.detalle}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/80">{n.hace}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, hydrated, logout, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !user) navigate({ to: "/login", replace: true });
  }, [hydrated, user, navigate]);

  if (!hydrated || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Logo />
          <p className="text-xs text-muted-foreground">Cargando tu espacio de trabajo…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Logo />
        </div>
        <NavList />
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2.5">
            <InitialsAvatar nombre={user.nombre} id="emp-2" size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold">{user.nombre}</p>
              <p className="truncate text-[11px] capitalize text-muted-foreground">{user.rol}</p>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          />
          <div className="absolute inset-y-0 left-0 flex w-[264px] flex-col border-r border-sidebar-border bg-sidebar animate-in slide-in-from-left duration-200">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
              <Logo />
              <button onClick={() => setMobileOpen(false)} aria-label="Cerrar">
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
            <NavList onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <button
            className="grid size-9 place-items-center rounded-lg border border-border lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="size-4" />
          </button>

          <div className="relative hidden max-w-sm flex-1 md:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar empleados, documentos, tareas…"
              className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <NotificationsBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg border border-border bg-card py-1 pl-1 pr-2.5 transition-colors hover:bg-muted">
                  <InitialsAvatar nombre={user.nombre} id="emp-2" size="sm" />
                  <span className="hidden text-left sm:block">
                    <span className="block text-[13px] font-semibold leading-tight">
                      {user.nombreCorto}
                    </span>
                    <span className="block text-[11px] leading-tight text-muted-foreground">
                      {user.puesto}
                    </span>
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/app/configuracion">Configuración</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/">Volver a la web</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    toast.success("Sesión cerrada");
                    navigate({ to: "/login", replace: true });
                  }}
                >
                  <LogOut className="size-4" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-4 py-7 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export { Button };
