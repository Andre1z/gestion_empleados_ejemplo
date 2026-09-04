import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, SlidersHorizontal, Users } from "lucide-react";
import { toast } from "sonner";
import { DEPARTAMENTOS, formatDate, type EmployeeStatus } from "@/lib/demo-data";
import { useApp } from "@/lib/store";
import {
  EmptyState,
  InitialsAvatar,
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/app/empleados/")({
  component: EmpleadosPage,
});

function EmpleadosPage() {
  const { employees, addEmployee, updateEmployee } = useApp();
  const [q, setQ] = useState("");
  const [dep, setDep] = useState("todos");
  const [estado, setEstado] = useState("todos");
  const [open, setOpen] = useState(false);

  const filtrados = useMemo(
    () =>
      employees.filter(
        (e) =>
          (dep === "todos" || e.departamento === dep) &&
          (estado === "todos" || e.estado === estado) &&
          (q === "" ||
            e.nombre.toLowerCase().includes(q.toLowerCase()) ||
            e.puesto.toLowerCase().includes(q.toLowerCase()) ||
            e.email.toLowerCase().includes(q.toLowerCase())),
      ),
    [employees, q, dep, estado],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Empleados"
        descripcion={`${employees.length} personas en plantilla · ${DEPARTAMENTOS.length} departamentos`}
      >
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Añadir empleado
        </Button>
      </PageHeader>

      <Panel>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, puesto o email…"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <Select value={dep} onValueChange={setDep}>
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los departamentos</SelectItem>
                {DEPARTAMENTOS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="vacaciones">De vacaciones</SelectItem>
                <SelectItem value="ausente">Ausente</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtrados.length === 0 ? (
          <EmptyState
            icon={<Users className="size-5" />}
            titulo="Ningún empleado coincide con los filtros"
            descripcion="Prueba con otro término de búsqueda o restablece los filtros para ver toda la plantilla."
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQ("");
                setDep("todos");
                setEstado("todos");
              }}
            >
              Restablecer filtros
            </Button>
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">Empleado</th>
                  <th className="px-5 py-3 font-semibold">Puesto</th>
                  <th className="px-5 py-3 font-semibold">Departamento</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 font-semibold">Incorporación</th>
                  <th className="px-5 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtrados.map((e) => (
                  <tr key={e.id} className="group transition-colors hover:bg-muted/50">
                    <td className="px-5 py-3">
                      <Link to="/app/empleados/$id" params={{ id: e.id }} className="flex items-center gap-3">
                        <InitialsAvatar nombre={e.nombre} id={e.id} size="sm" />
                        <span>
                          <span className="block font-medium text-foreground group-hover:text-primary">
                            {e.nombre}
                          </span>
                          <span className="block text-xs text-muted-foreground">{e.email}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{e.puesto}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        {e.departamento}
                      </span>
                    </td>
                    <td className="px-5 py-3"><StatusPill estado={e.estado} /></td>
                    <td className="px-5 py-3 text-muted-foreground">{formatDate(e.incorporacion)}</td>
                    <td className="px-5 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">···</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to="/app/empleados/$id" params={{ id: e.id }}>Ver perfil</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              updateEmployee(e.id, {
                                estado: (e.estado === "activo" ? "ausente" : "activo") as EmployeeStatus,
                              });
                              toast.success("Estado actualizado", { description: e.nombre });
                            }}
                          >
                            Cambiar estado
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toast.info("Enlace de acceso enviado", { description: e.email })
                            }
                          >
                            Reenviar acceso
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          Mostrando {filtrados.length} de {employees.length} empleados
        </div>
      </Panel>

      <NuevoEmpleadoDialog open={open} onOpenChange={setOpen} onCreate={addEmployee} />
    </div>
  );
}

function NuevoEmpleadoDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: ReturnType<typeof useApp>["addEmployee"];
}) {
  const [dep, setDep] = useState<string>(DEPARTAMENTOS[0]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Añadir empleado</DialogTitle>
          <DialogDescription>
            Se creará la ficha y se enviará la invitación de acceso a PeopleFlow.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(ev) => {
            ev.preventDefault();
            const f = new FormData(ev.currentTarget as HTMLFormElement);
            const nombre = String(f.get("nombre"));
            onCreate({
              nombre,
              puesto: String(f.get("puesto")),
              departamento: dep,
              email: String(f.get("email")),
              telefono: String(f.get("telefono") || "—"),
              incorporacion: String(f.get("incorporacion")),
              estado: "activo",
              rol: "empleado",
              ubicacion: "Madrid",
              contrato: "Indefinido",
              diasVacaciones: 30,
              diasUsados: 0,
            });
            onOpenChange(false);
            toast.success("Empleado creado", { description: `${nombre} ya está en la plantilla.` });
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input id="nombre" name="nombre" required placeholder="Lucía Ferrer" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="puesto">Puesto</Label>
              <Input id="puesto" name="puesto" required placeholder="Product Designer" />
            </div>
            <div className="space-y-1.5">
              <Label>Departamento</Label>
              <Select value={dep} onValueChange={setDep}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEPARTAMENTOS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="incorporacion">Fecha de incorporación</Label>
              <Input id="incorporacion" name="incorporacion" type="date" required defaultValue="2026-09-15" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="lucia.ferrer@peopleflow.es" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" placeholder="+34 600 000 000" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear empleado</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
