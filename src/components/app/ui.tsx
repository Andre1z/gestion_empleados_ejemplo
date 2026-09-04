import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { avatarTone, initials } from "@/lib/demo-data";
import { Skeleton } from "@/components/ui/skeleton";

export function InitialsAvatar({
  nombre,
  id,
  size = "md",
  className,
}: {
  nombre: string;
  id: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "size-8 text-[11px]",
    md: "size-10 text-xs",
    lg: "size-14 text-sm",
    xl: "size-20 text-lg",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide",
        sizes[size],
        avatarTone(id),
        className,
      )}
      aria-hidden
    >
      {initials(nombre)}
    </span>
  );
}

export function PageHeader({
  titulo,
  descripcion,
  children,
}: {
  titulo: string;
  descripcion?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{titulo}</h1>
        {descripcion ? (
          <p className="mt-1.5 text-sm text-muted-foreground">{descripcion}</p>
        ) : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "primary";
}) {
  const tones = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-accent text-accent-foreground",
    success: "bg-success/12 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-destructive/12 text-destructive",
  };
  return (
    <div className="panel group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        {icon ? (
          <span className={cn("grid size-9 place-items-center rounded-lg", tones[tone])}>
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Panel({
  titulo,
  accion,
  children,
  className,
  descripcion,
}: {
  titulo?: string;
  descripcion?: string;
  accion?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel", className)}>
      {titulo ? (
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">{titulo}</h2>
            {descripcion ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{descripcion}</p>
            ) : null}
          </div>
          {accion}
        </header>
      ) : null}
      {children}
    </section>
  );
}

const STATUS_STYLES: Record<string, string> = {
  activo: "bg-success/12 text-success",
  activa: "bg-success/12 text-success",
  vacaciones: "bg-info/12 text-info",
  ausente: "bg-warning/18 text-warning",
  baja: "bg-muted text-muted-foreground",
  pendiente: "bg-warning/18 text-warning",
  aprobada: "bg-success/12 text-success",
  rechazada: "bg-destructive/12 text-destructive",
  completada: "bg-success/12 text-success",
  progreso: "bg-info/12 text-info",
  programada: "bg-accent text-accent-foreground",
  alta: "bg-destructive/12 text-destructive",
  media: "bg-warning/18 text-warning",
  baja_prio: "bg-muted text-muted-foreground",
  Firmado: "bg-success/12 text-success",
  "Pendiente de firma": "bg-warning/18 text-warning",
  Archivado: "bg-muted text-muted-foreground",
};

export function StatusPill({
  estado,
  label,
  className,
}: {
  estado: string;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
        STATUS_STYLES[estado] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {label ?? estado}
    </span>
  );
}

export function EmptyState({
  titulo,
  descripcion,
  icon,
  children,
}: {
  titulo: string;
  descripcion?: string;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {icon ? (
        <span className="grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
          {icon}
        </span>
      ) : null}
      <p className="text-sm font-semibold text-foreground">{titulo}</p>
      {descripcion ? (
        <p className="max-w-sm text-xs text-muted-foreground">{descripcion}</p>
      ) : null}
      {children}
    </div>
  );
}

export function LoadingRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="hidden h-4 w-28 sm:block" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
