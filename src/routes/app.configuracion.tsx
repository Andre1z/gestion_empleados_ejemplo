import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Moon, Shield, Sun } from "lucide-react";
import { toast } from "sonner";
import { DEPARTAMENTOS } from "@/lib/demo-data";
import { useApp, useEmployeeMap } from "@/lib/store";
import { InitialsAvatar, PageHeader, Panel, StatusPill } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/configuracion")({
  component: ConfiguracionPage,
});

const ROLES = [
  { rol: "Administrador", descripcion: "Acceso total: empleados, fichajes, nóminas, configuración y facturación.", permisos: "Todos los módulos" },
  { rol: "Manager", descripcion: "Gestiona su equipo: aprueba vacaciones, asigna tareas y evalúa.", permisos: "Su departamento" },
  { rol: "Empleado", descripcion: "Ficha, solicita vacaciones y consulta sus documentos y tareas.", permisos: "Sus propios datos" },
];

function ConfiguracionPage() {
  const { employees, theme, toggleTheme } = useApp();
  const empMap = useEmployeeMap();
  const [notif, setNotif] = useState({ email: true, push: true, resumen: false, fichaje: true });

  const guardar = (msg: string) => toast.success(msg);

  return (
    <div className="space-y-6">
      <PageHeader titulo="Configuración" descripcion="Empresa, usuarios, permisos y políticas de PeopleFlow." />

      <Tabs defaultValue="empresa" className="space-y-5">
        <TabsList className="flex-wrap">
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="departamentos">Departamentos</TabsTrigger>
          <TabsTrigger value="roles">Roles y permisos</TabsTrigger>
          <TabsTrigger value="horarios">Horarios</TabsTrigger>
          <TabsTrigger value="vacaciones">Políticas</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="empresa">
          <Panel titulo="Perfil de empresa" descripcion="Datos fiscales y de contacto">
            <form
              className="space-y-5 p-5"
              onSubmit={(e) => { e.preventDefault(); guardar("Datos de empresa actualizados"); }}
            >
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Building2 className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Nordia Tech S.L.</p>
                  <p className="text-xs text-muted-foreground">Plan Business · 48 empleados</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="razon">Razón social</Label>
                  <Input id="razon" defaultValue="Nordia Tech S.L." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cif">CIF</Label>
                  <Input id="cif" defaultValue="B-87654321" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dir">Dirección</Label>
                  <Input id="dir" defaultValue="Calle Serrano 41, 28001 Madrid" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tel">Teléfono</Label>
                  <Input id="tel" defaultValue="+34 910 55 32 18" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="desc">Descripción</Label>
                <Textarea id="desc" rows={3} defaultValue="Consultora tecnológica especializada en producto digital B2B." />
              </div>
              <Button type="submit">Guardar cambios</Button>
            </form>
          </Panel>
        </TabsContent>

        <TabsContent value="usuarios">
          <Panel titulo="Usuarios con acceso" descripcion="Cuentas activas en la plataforma">
            <ul className="divide-y divide-border">
              {employees.slice(0, 8).map((e) => (
                <li key={e.id} className="flex items-center gap-3 px-5 py-4">
                  <InitialsAvatar nombre={e.nombre} id={e.id} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{e.nombre}</p>
                    <p className="text-xs text-muted-foreground">{e.email}</p>
                  </div>
                  <span className="hidden text-xs capitalize text-muted-foreground sm:block">{e.rol}</span>
                  <StatusPill estado={e.estado} />
                  <Button size="sm" variant="outline" onClick={() => guardar(`Invitación reenviada a ${e.nombre}`)}>
                    Reenviar acceso
                  </Button>
                </li>
              ))}
            </ul>
          </Panel>
        </TabsContent>

        <TabsContent value="departamentos">
          <Panel titulo="Departamentos" descripcion="Estructura organizativa">
            <ul className="divide-y divide-border">
              {DEPARTAMENTOS.map((d) => {
                const n = employees.filter((e) => e.departamento === d).length;
                return (
                  <li key={d} className="flex items-center gap-3 px-5 py-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{d}</p>
                      <p className="text-xs text-muted-foreground">{n} empleados</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => guardar(`Departamento ${d} actualizado`)}>
                      Editar
                    </Button>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </TabsContent>

        <TabsContent value="roles">
          <div className="grid gap-4 lg:grid-cols-3">
            {ROLES.map((r) => (
              <Panel key={r.rol} titulo={r.rol} descripcion={r.permisos}>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground">{r.descripcion}</p>
                  <p className="mt-4 text-xs font-medium text-muted-foreground">
                    {employees.filter((e) => e.rol === r.rol.toLowerCase().replace("administrador", "admin")).length} usuarios con este rol
                  </p>
                </div>
              </Panel>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="horarios">
          <Panel titulo="Jornada por defecto" descripcion="Se aplica a los nuevos empleados">
            <form className="grid gap-4 p-5 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); guardar("Horario por defecto guardado"); }}>
              <div className="space-y-1.5"><Label>Entrada</Label><Input type="time" defaultValue="09:00" /></div>
              <div className="space-y-1.5"><Label>Salida</Label><Input type="time" defaultValue="18:00" /></div>
              <div className="space-y-1.5"><Label>Pausa (minutos)</Label><Input type="number" defaultValue={60} /></div>
              <div className="space-y-1.5"><Label>Horas semanales</Label><Input type="number" defaultValue={40} /></div>
              <div className="sm:col-span-2"><Button type="submit">Guardar horario</Button></div>
            </form>
          </Panel>
        </TabsContent>

        <TabsContent value="vacaciones">
          <Panel titulo="Política de vacaciones" descripcion="Reglas aplicadas a las solicitudes">
            <form className="space-y-5 p-5" onSubmit={(e) => { e.preventDefault(); guardar("Política de vacaciones guardada"); }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Días anuales</Label><Input type="number" defaultValue={30} /></div>
                <div className="space-y-1.5"><Label>Antelación mínima (días)</Label><Input type="number" defaultValue={7} /></div>
              </div>
              <label className="flex items-center justify-between rounded-xl border border-border p-4">
                <span className="text-sm">Permitir medias jornadas</span>
                <Switch defaultChecked />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-border p-4">
                <span className="text-sm">Aprobación automática si hay saldo disponible</span>
                <Switch />
              </label>
              <Button type="submit">Guardar política</Button>
            </form>
          </Panel>
        </TabsContent>

        <TabsContent value="notificaciones">
          <Panel titulo="Notificaciones" descripcion="Cómo quieres recibir los avisos">
            <div className="space-y-3 p-5">
              {([
                ["email", "Notificaciones por email"],
                ["push", "Notificaciones push en el navegador"],
                ["resumen", "Resumen semanal de actividad"],
                ["fichaje", "Recordatorio de fichaje diario"],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between rounded-xl border border-border p-4">
                  <span className="text-sm">{label}</span>
                  <Switch
                    checked={notif[key]}
                    onCheckedChange={(v) => {
                      setNotif((p) => ({ ...p, [key]: v }));
                      toast.success(v ? "Notificación activada" : "Notificación desactivada", { description: label });
                    }}
                  />
                </label>
              ))}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="seguridad">
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel titulo="Seguridad de la cuenta" descripcion="Acceso y autenticación">
              <div className="space-y-3 p-5">
                <label className="flex items-center justify-between rounded-xl border border-border p-4">
                  <span className="flex items-center gap-2 text-sm"><Shield className="size-4 text-primary" /> Doble factor (2FA)</span>
                  <Switch defaultChecked />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-border p-4">
                  <span className="text-sm">Cerrar sesión tras 30 min de inactividad</span>
                  <Switch defaultChecked />
                </label>
                <Button variant="outline" onClick={() => guardar("Se ha enviado el enlace de cambio de contraseña")}>
                  Cambiar contraseña
                </Button>
              </div>
            </Panel>
            <Panel titulo="Apariencia" descripcion="Tema de la interfaz">
              <div className="p-5">
                <label className="flex items-center justify-between rounded-xl border border-border p-4">
                  <span className="flex items-center gap-2 text-sm">
                    {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                    Modo oscuro
                  </span>
                  <Switch checked={theme === "dark"} onCheckedChange={() => toggleTheme()} />
                </label>
                <p className="mt-3 text-xs text-muted-foreground">
                  La preferencia se guarda en este dispositivo.
                </p>
              </div>
            </Panel>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
