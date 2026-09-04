import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Eye, FileText, Search, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { formatDate, type DocumentItem } from "@/lib/demo-data";
import { useApp, useEmployeeMap } from "@/lib/store";
import {
  EmptyState,
  PageHeader,
  Panel,
  StatCard,
  StatusPill,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

export const Route = createFileRoute("/app/documentos")({
  component: DocumentosPage,
});

const CATEGORIAS: DocumentItem["categoria"][] = [
  "Contratos",
  "Nóminas",
  "Documentación personal",
  "Políticas internas",
  "Otros",
];

function DocumentosPage() {
  const { documents, addDocument, removeDocument, employees } = useApp();
  const empMap = useEmployeeMap();
  const [cat, setCat] = useState<string>("todas");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [borrar, setBorrar] = useState<DocumentItem | null>(null);
  const [nuevaCat, setNuevaCat] = useState<DocumentItem["categoria"]>("Contratos");
  const [empleado, setEmpleado] = useState("emp-1");

  const filtrados = useMemo(
    () =>
      documents.filter(
        (d) =>
          (cat === "todas" || d.categoria === cat) &&
          (q === "" || d.nombre.toLowerCase().includes(q.toLowerCase())),
      ),
    [documents, cat, q],
  );

  const pendientes = documents.filter((d) => d.estado === "Pendiente de firma").length;

  return (
    <div className="space-y-6">
      <PageHeader titulo="Documentos" descripcion="Gestor documental de la empresa y de cada empleado.">
        <Button onClick={() => setOpen(true)}>
          <Upload className="size-4" /> Subir documento
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Documentos" value={documents.length} hint="Archivados en el gestor" icon={<FileText className="size-4" />} tone="primary" />
        <StatCard label="Pendientes de firma" value={pendientes} hint="Requieren acción" tone="warning" />
        <StatCard label="Categorías" value={CATEGORIAS.length} hint="Estructura documental" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {["todas", ...CATEGORIAS].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              cat === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {c === "todas" ? "Todas" : c}
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar documento…" className="pl-9" />
        </div>
      </div>

      {filtrados.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<FileText className="size-5" />}
            titulo="Sin documentos en esta categoría"
            descripcion="Sube el primer documento para empezar a organizar la documentación."
          >
            <Button size="sm" onClick={() => setOpen(true)}>
              <Upload className="size-4" /> Subir documento
            </Button>
          </EmptyState>
        </Panel>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtrados.map((d) => (
            <article
              key={d.id}
              className="panel flex flex-col p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <FileText className="size-5" />
                </span>
                <StatusPill estado={d.estado} label={d.estado} />
              </div>
              <h3 className="mt-4 line-clamp-2 text-sm font-semibold">{d.nombre}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {empMap.get(d.empleadoId)?.nombre} · {d.categoria}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(d.fecha)} · {d.tipo} · {d.peso}
              </p>
              <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                <Button size="sm" variant="outline" onClick={() => toast.info("Previsualización abierta", { description: d.nombre })}>
                  <Eye className="size-3.5" /> Ver
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Descarga iniciada", { description: d.nombre })}>
                  <Download className="size-3.5" /> Descargar
                </Button>
                <Button size="sm" variant="ghost" className="ml-auto text-destructive" onClick={() => setBorrar(d)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subir documento</DialogTitle>
            <DialogDescription>Asocia el archivo a un empleado y una categoría.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              const f = new FormData(ev.currentTarget as HTMLFormElement);
              const nombre = String(f.get("nombre"));
              addDocument({
                nombre: nombre.endsWith(".pdf") ? nombre : `${nombre}.pdf`,
                empleadoId: empleado,
                categoria: nuevaCat,
                fecha: "2026-09-04",
                tipo: "PDF",
                peso: "184 KB",
                estado: "Pendiente de firma",
              });
              setOpen(false);
              toast.success("Documento subido", { description: nombre });
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre del documento</Label>
              <Input id="nombre" name="nombre" required placeholder="Contrato indefinido — Lucía Ferrer" />
            </div>
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
              <Label>Categoría</Label>
              <Select value={nuevaCat} onValueChange={(v) => setNuevaCat(v as DocumentItem["categoria"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center">
              <Upload className="mx-auto size-5 text-muted-foreground" />
              <p className="mt-2 text-xs text-muted-foreground">
                Arrastra el archivo aquí o haz clic para seleccionarlo (demo)
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">Subir documento</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!borrar} onOpenChange={(v) => !v && setBorrar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará «{borrar?.nombre}» del gestor documental. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (borrar) {
                  removeDocument(borrar.id);
                  toast.success("Documento eliminado");
                }
                setBorrar(null);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
