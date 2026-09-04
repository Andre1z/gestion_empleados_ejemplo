// Datos ficticios deterministas para la demo de PeopleFlow.
// Generados con un PRNG con semilla fija para evitar diferencias
// entre el render de servidor y el de cliente.

export type Role = "admin" | "manager" | "empleado";
export type EmployeeStatus = "activo" | "vacaciones" | "ausente" | "baja";

export interface Employee {
  id: string;
  nombre: string;
  puesto: string;
  departamento: string;
  email: string;
  telefono: string;
  incorporacion: string;
  estado: EmployeeStatus;
  rol: Role;
  ubicacion: string;
  contrato: string;
  diasVacaciones: number;
  diasUsados: number;
}

export interface VacationRequest {
  id: string;
  empleadoId: string;
  desde: string;
  hasta: string;
  dias: number;
  estado: "pendiente" | "aprobada" | "rechazada";
  motivo: string;
}

export interface Absence {
  id: string;
  empleadoId: string;
  tipo: "Enfermedad" | "Asuntos personales" | "Permiso" | "No justificada" | "Otro";
  fecha: string;
  dias: number;
  justificada: boolean;
  nota: string;
}

export interface DocumentItem {
  id: string;
  nombre: string;
  empleadoId: string;
  categoria: "Contratos" | "Nóminas" | "Documentación personal" | "Políticas internas" | "Otros";
  fecha: string;
  tipo: "PDF" | "DOCX" | "XLSX";
  peso: string;
  estado: "Firmado" | "Pendiente de firma" | "Archivado";
}

export interface Task {
  id: string;
  titulo: string;
  descripcion: string;
  responsableId: string;
  prioridad: "alta" | "media" | "baja";
  limite: string;
  estado: "pendiente" | "progreso" | "completada";
}

export interface Evaluation {
  id: string;
  empleadoId: string;
  periodo: string;
  fecha: string;
  estado: "pendiente" | "completada" | "programada";
  productividad: number;
  equipo: number;
  comunicacion: number;
  responsabilidad: number;
  objetivos: number;
  comentarios: string;
}

export interface CalendarEvent {
  id: string;
  titulo: string;
  fecha: string;
  tipo: "vacaciones" | "ausencia" | "reunion" | "evento" | "evaluacion" | "importante";
  hora?: string;
  empleadoId?: string;
}

export interface Announcement {
  id: string;
  titulo: string;
  mensaje: string;
  autorId: string;
  fecha: string;
  destinatarios: string;
  fijado: boolean;
}

export interface ClockEntry {
  id: string;
  empleadoId: string;
  fecha: string;
  entrada: string;
  salida: string | null;
  pausas: number;
  horas: number;
}

export interface Notification {
  id: string;
  icono: "vacaciones" | "documento" | "evaluacion" | "comunicacion";
  titulo: string;
  detalle: string;
  hace: string;
  leida: boolean;
}

export interface ScheduleShift {
  turno: "Mañana" | "Tarde" | "Partido" | "Libre";
  inicio: string;
  fin: string;
}

export interface Schedule {
  empleadoId: string;
  dias: ScheduleShift[]; // lunes..domingo
}

export const DEPARTAMENTOS = [
  "Marketing",
  "Ventas",
  "Recursos Humanos",
  "IT",
  "Operaciones",
] as const;

export const HOY = "2026-09-04";

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
const rand = rng(20260904);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)]!;
const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));

const NOMBRES = [
  "María López", "Carlos García", "Ana Martínez", "Javier Pérez", "Laura Sánchez",
  "Miguel Torres", "Elena Ruiz", "Pablo Jiménez", "Cristina Moreno", "Daniel Navarro",
  "Sofía Romero", "Alberto Gil", "Marta Vega", "Sergio Castro", "Lucía Ortega",
  "Andrés Molina", "Patricia Ramos", "Iván Delgado", "Nuria Blanco", "Rubén Herrera",
  "Claudia Ibáñez", "Óscar Fuentes", "Beatriz Campos", "Hugo Marín", "Silvia Cabrera",
  "Adrián Pardo", "Raquel Soler", "Víctor Aguilar", "Irene Lorenzo", "Diego Estévez",
  "Alicia Nieto", "Gonzalo Bravo", "Teresa Rivas", "Álvaro Cortés", "Rocío Peña",
  "Manuel Serrano", "Carmen Vidal", "Jorge Rey", "Natalia Prieto", "Fernando Calvo",
  "Eva Montero", "Ignacio Lara", "Sara Bermúdez", "Alejandro Duarte", "Pilar Guerrero",
  "Tomás Alonso", "Julia Santana", "Emilio Rueda",
];

const PUESTOS: Record<string, string[]> = {
  Marketing: ["Marketing Manager", "Content Strategist", "Growth Specialist", "Diseñadora gráfica", "Community Manager"],
  Ventas: ["Account Executive", "Sales Manager", "SDR", "Key Account Manager", "Inside Sales"],
  "Recursos Humanos": ["HR Business Partner", "Técnica de selección", "Responsable de Formación", "HR Generalist"],
  IT: ["Backend Developer", "Frontend Developer", "DevOps Engineer", "QA Engineer", "Tech Lead"],
  Operaciones: ["Operations Manager", "Coordinador logístico", "Analista de procesos", "Office Manager"],
};

const CIUDADES = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Remoto"];
const CONTRATOS = ["Indefinido", "Temporal", "Prácticas"];

function slugMail(nombre: string) {
  const [n, a] = nombre.toLowerCase().split(" ");
  return `${n}.${a}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") + "@peopleflow.es";
}

export const employees: Employee[] = NOMBRES.map((nombre, i) => {
  const departamento = DEPARTAMENTOS[i % DEPARTAMENTOS.length]!;
  const estado: EmployeeStatus =
    i === 4 || i === 11 || i === 27 ? "vacaciones" : i === 7 || i === 19 || i === 33 ? "ausente" : "activo";
  const diasUsados = int(2, 20);
  return {
    id: `emp-${i + 1}`,
    nombre,
    puesto: pick(PUESTOS[departamento]!),
    departamento,
    email: slugMail(nombre),
    telefono: `+34 6${int(10, 99)} ${int(100, 999)} ${int(100, 999)}`,
    incorporacion: `20${int(18, 25)}-${String(int(1, 12)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
    estado,
    rol: i === 1 ? "admin" : i < 6 ? "manager" : "empleado",
    ubicacion: pick(CIUDADES),
    contrato: pick(CONTRATOS),
    diasVacaciones: 30,
    diasUsados,
  };
});

export const currentUser = {
  id: "emp-2",
  nombre: "Carlos García",
  nombreCorto: "Carlos",
  puesto: "Director de Personas",
  email: "carlos.garcia@peopleflow.es",
  rol: "admin" as Role,
};

export const vacations: VacationRequest[] = [
  { id: "vac-1", empleadoId: "emp-1", desde: "2026-09-10", hasta: "2026-09-15", dias: 4, estado: "pendiente", motivo: "Vacaciones de verano" },
  { id: "vac-2", empleadoId: "emp-2", desde: "2026-09-20", hasta: "2026-09-25", dias: 4, estado: "aprobada", motivo: "Descanso familiar" },
  { id: "vac-3", empleadoId: "emp-3", desde: "2026-09-08", hasta: "2026-09-09", dias: 2, estado: "pendiente", motivo: "Asuntos propios" },
  { id: "vac-4", empleadoId: "emp-5", desde: "2026-09-01", hasta: "2026-09-12", dias: 10, estado: "aprobada", motivo: "Vacaciones" },
  { id: "vac-5", empleadoId: "emp-8", desde: "2026-10-05", hasta: "2026-10-09", dias: 5, estado: "pendiente", motivo: "Viaje" },
  { id: "vac-6", empleadoId: "emp-12", desde: "2026-09-02", hasta: "2026-09-06", dias: 5, estado: "aprobada", motivo: "Vacaciones" },
  { id: "vac-7", empleadoId: "emp-14", desde: "2026-11-23", hasta: "2026-11-27", dias: 5, estado: "rechazada", motivo: "Cierre trimestral" },
  { id: "vac-8", empleadoId: "emp-21", desde: "2026-12-22", hasta: "2027-01-02", dias: 8, estado: "pendiente", motivo: "Navidad" },
];

export const absences: Absence[] = [
  { id: "aus-1", empleadoId: "emp-8", tipo: "Enfermedad", fecha: "2026-09-03", dias: 2, justificada: true, nota: "Baja médica con parte de reposo" },
  { id: "aus-2", empleadoId: "emp-20", tipo: "Asuntos personales", fecha: "2026-09-04", dias: 1, justificada: true, nota: "Gestión bancaria" },
  { id: "aus-3", empleadoId: "emp-34", tipo: "No justificada", fecha: "2026-09-02", dias: 1, justificada: false, nota: "Sin aviso previo" },
  { id: "aus-4", empleadoId: "emp-15", tipo: "Permiso", fecha: "2026-08-28", dias: 3, justificada: true, nota: "Mudanza" },
  { id: "aus-5", empleadoId: "emp-9", tipo: "Enfermedad", fecha: "2026-08-24", dias: 4, justificada: true, nota: "Gripe" },
  { id: "aus-6", empleadoId: "emp-30", tipo: "Otro", fecha: "2026-08-19", dias: 1, justificada: true, nota: "Formación externa" },
];

export const documents: DocumentItem[] = [
  { id: "doc-1", nombre: "Contrato indefinido — María López.pdf", empleadoId: "emp-1", categoria: "Contratos", fecha: "2026-01-15", tipo: "PDF", peso: "412 KB", estado: "Firmado" },
  { id: "doc-2", nombre: "Nómina agosto 2026 — Carlos García.pdf", empleadoId: "emp-2", categoria: "Nóminas", fecha: "2026-08-31", tipo: "PDF", peso: "128 KB", estado: "Archivado" },
  { id: "doc-3", nombre: "DNI — Ana Martínez.pdf", empleadoId: "emp-3", categoria: "Documentación personal", fecha: "2026-02-04", tipo: "PDF", peso: "96 KB", estado: "Archivado" },
  { id: "doc-4", nombre: "Política de teletrabajo 2026.pdf", empleadoId: "emp-3", categoria: "Políticas internas", fecha: "2026-03-12", tipo: "PDF", peso: "220 KB", estado: "Pendiente de firma" },
  { id: "doc-5", nombre: "Anexo salarial — Javier Pérez.docx", empleadoId: "emp-4", categoria: "Contratos", fecha: "2026-07-01", tipo: "DOCX", peso: "78 KB", estado: "Pendiente de firma" },
  { id: "doc-6", nombre: "Nómina agosto 2026 — Laura Sánchez.pdf", empleadoId: "emp-5", categoria: "Nóminas", fecha: "2026-08-31", tipo: "PDF", peso: "131 KB", estado: "Archivado" },
  { id: "doc-7", nombre: "Plan de formación Q4.xlsx", empleadoId: "emp-3", categoria: "Otros", fecha: "2026-08-20", tipo: "XLSX", peso: "512 KB", estado: "Archivado" },
  { id: "doc-8", nombre: "Prevención de riesgos laborales.pdf", empleadoId: "emp-11", categoria: "Políticas internas", fecha: "2026-05-18", tipo: "PDF", peso: "1,2 MB", estado: "Firmado" },
  { id: "doc-9", nombre: "Certificado bancario — Miguel Torres.pdf", empleadoId: "emp-6", categoria: "Documentación personal", fecha: "2026-04-09", tipo: "PDF", peso: "64 KB", estado: "Archivado" },
  { id: "doc-10", nombre: "Contrato prácticas — Hugo Marín.pdf", empleadoId: "emp-24", categoria: "Contratos", fecha: "2026-06-02", tipo: "PDF", peso: "302 KB", estado: "Firmado" },
];

export const tasks: Task[] = [
  { id: "task-1", titulo: "Revisar documentación de nuevos empleados", descripcion: "Validar contratos y altas en Seguridad Social de las 4 incorporaciones de septiembre.", responsableId: "emp-3", prioridad: "alta", limite: "2026-09-08", estado: "pendiente" },
  { id: "task-2", titulo: "Preparar evaluación trimestral", descripcion: "Plantillas y calendario de evaluaciones Q3 para todos los departamentos.", responsableId: "emp-2", prioridad: "alta", limite: "2026-09-12", estado: "progreso" },
  { id: "task-3", titulo: "Actualizar horarios de Operaciones", descripcion: "Nuevo turno de tarde a partir del 15 de septiembre.", responsableId: "emp-5", prioridad: "media", limite: "2026-09-15", estado: "pendiente" },
  { id: "task-4", titulo: "Cerrar nóminas de agosto", descripcion: "Revisar variables y horas extra antes del envío a gestoría.", responsableId: "emp-3", prioridad: "alta", limite: "2026-09-05", estado: "progreso" },
  { id: "task-5", titulo: "Onboarding de Hugo Marín", descripcion: "Equipo, accesos y plan de bienvenida de 30 días.", responsableId: "emp-4", prioridad: "media", limite: "2026-09-09", estado: "progreso" },
  { id: "task-6", titulo: "Publicar política de vacaciones", descripcion: "Comunicar la nueva política y recoger acuses de lectura.", responsableId: "emp-1", prioridad: "baja", limite: "2026-09-18", estado: "pendiente" },
  { id: "task-7", titulo: "Auditoría de accesos IT", descripcion: "Revisar permisos de las bajas del último trimestre.", responsableId: "emp-9", prioridad: "media", limite: "2026-08-29", estado: "completada" },
  { id: "task-8", titulo: "Encuesta de clima laboral", descripcion: "Enviar encuesta anónima y consolidar resultados.", responsableId: "emp-13", prioridad: "baja", limite: "2026-08-25", estado: "completada" },
];

export const evaluations: Evaluation[] = [
  { id: "ev-1", empleadoId: "emp-1", periodo: "Q3 2026", fecha: "2026-09-01", estado: "completada", productividad: 8.7, equipo: 9.2, comunicacion: 8.9, responsabilidad: 9.0, objetivos: 8.6, comentarios: "Excelente liderazgo en la campaña de rebranding. Área de mejora: delegación." },
  { id: "ev-2", empleadoId: "emp-4", periodo: "Q3 2026", fecha: "2026-08-28", estado: "completada", productividad: 9.1, equipo: 8.4, comunicacion: 8.0, responsabilidad: 9.3, objetivos: 9.0, comentarios: "Gran capacidad técnica y autonomía. Impulsar más la comunicación transversal." },
  { id: "ev-3", empleadoId: "emp-3", periodo: "Q3 2026", fecha: "2026-09-11", estado: "pendiente", productividad: 0, equipo: 0, comunicacion: 0, responsabilidad: 0, objetivos: 0, comentarios: "" },
  { id: "ev-4", empleadoId: "emp-6", periodo: "Q3 2026", fecha: "2026-09-12", estado: "pendiente", productividad: 0, equipo: 0, comunicacion: 0, responsabilidad: 0, objetivos: 0, comentarios: "" },
  { id: "ev-5", empleadoId: "emp-5", periodo: "Q4 2026", fecha: "2026-11-05", estado: "programada", productividad: 0, equipo: 0, comunicacion: 0, responsabilidad: 0, objetivos: 0, comentarios: "" },
  { id: "ev-6", empleadoId: "emp-8", periodo: "Q2 2026", fecha: "2026-06-20", estado: "completada", productividad: 7.8, equipo: 8.1, comunicacion: 8.5, responsabilidad: 7.9, objetivos: 7.6, comentarios: "Progresión estable respecto a Q1." },
];

export const evolucionEvaluaciones = [
  { periodo: "Q3 2025", media: 7.6 },
  { periodo: "Q4 2025", media: 7.9 },
  { periodo: "Q1 2026", media: 8.2 },
  { periodo: "Q2 2026", media: 8.5 },
  { periodo: "Q3 2026", media: 8.9 },
];

export const calendarEvents: CalendarEvent[] = [
  { id: "cal-1", titulo: "Reunión general de empresa", fecha: "2026-09-04", tipo: "reunion", hora: "10:00" },
  { id: "cal-2", titulo: "Vacaciones — Laura Sánchez", fecha: "2026-09-08", tipo: "vacaciones", empleadoId: "emp-5" },
  { id: "cal-3", titulo: "Evaluación Q3 — Ana Martínez", fecha: "2026-09-11", tipo: "evaluacion", hora: "12:00", empleadoId: "emp-3" },
  { id: "cal-4", titulo: "Comité de dirección", fecha: "2026-09-15", tipo: "reunion", hora: "09:30" },
  { id: "cal-5", titulo: "Ausencia — Pablo Jiménez", fecha: "2026-09-03", tipo: "ausencia", empleadoId: "emp-8" },
  { id: "cal-6", titulo: "Cierre de nóminas", fecha: "2026-09-25", tipo: "importante" },
  { id: "cal-7", titulo: "Team building Operaciones", fecha: "2026-09-19", tipo: "evento", hora: "16:00" },
  { id: "cal-8", titulo: "Formación LOPD", fecha: "2026-09-22", tipo: "evento", hora: "11:00" },
  { id: "cal-9", titulo: "Vacaciones — María López", fecha: "2026-09-10", tipo: "vacaciones", empleadoId: "emp-1" },
  { id: "cal-10", titulo: "Onboarding nuevas incorporaciones", fecha: "2026-09-07", tipo: "evento", hora: "09:00" },
];

export const announcements: Announcement[] = [
  { id: "an-1", titulo: "Reunión general — Viernes 10:00", mensaje: "Nos vemos en la sala Atlas para revisar los resultados del trimestre y presentar los objetivos de Q4. Se retransmitirá por vídeo para el equipo remoto.", autorId: "emp-2", fecha: "2026-09-03", destinatarios: "Toda la empresa", fijado: true },
  { id: "an-2", titulo: "Nueva política de vacaciones", mensaje: "A partir de octubre las solicitudes se aprobarán en un máximo de 48 horas y se podrán fraccionar en medias jornadas.", autorId: "emp-3", fecha: "2026-09-01", destinatarios: "Toda la empresa", fijado: true },
  { id: "an-3", titulo: "Mantenimiento del sistema", mensaje: "El sábado de 08:00 a 12:00 el portal estará en mantenimiento programado. Los fichajes se registrarán con normalidad desde el móvil.", autorId: "emp-9", fecha: "2026-08-30", destinatarios: "Toda la empresa", fijado: false },
  { id: "an-4", titulo: "Bienvenida a las nuevas incorporaciones", mensaje: "Se incorporan 4 personas a los equipos de IT y Ventas. ¡Dadles la bienvenida!", autorId: "emp-3", fecha: "2026-08-27", destinatarios: "IT, Ventas", fijado: false },
];

export const notifications: Notification[] = [
  { id: "not-1", icono: "vacaciones", titulo: "Nueva solicitud de vacaciones", detalle: "María López · 10 – 15 septiembre", hace: "hace 12 min", leida: false },
  { id: "not-2", icono: "documento", titulo: "Documento pendiente de firmar", detalle: "Anexo salarial — Javier Pérez", hace: "hace 1 h", leida: false },
  { id: "not-3", icono: "evaluacion", titulo: "Evaluación pendiente", detalle: "Ana Martínez · Q3 2026", hace: "hace 3 h", leida: false },
  { id: "not-4", icono: "comunicacion", titulo: "Nueva comunicación", detalle: "Nueva política de vacaciones", hace: "ayer", leida: true },
];

export const asistencia7dias = [
  { dia: "Sáb", presentes: 6, ausentes: 0, vacaciones: 2 },
  { dia: "Dom", presentes: 4, ausentes: 0, vacaciones: 2 },
  { dia: "Lun", presentes: 44, ausentes: 2, vacaciones: 2 },
  { dia: "Mar", presentes: 43, ausentes: 2, vacaciones: 3 },
  { dia: "Mié", presentes: 45, ausentes: 1, vacaciones: 2 },
  { dia: "Jue", presentes: 41, ausentes: 4, vacaciones: 3 },
  { dia: "Vie", presentes: 42, ausentes: 3, vacaciones: 3 },
];

export const horasTrabajadas = [
  { semana: "S31", horas: 1682 },
  { semana: "S32", horas: 1740 },
  { semana: "S33", horas: 1610 },
  { semana: "S34", horas: 1755 },
  { semana: "S35", horas: 1798 },
  { semana: "S36", horas: 1712 },
];

export const vacacionesPorMes = [
  { mes: "Abr", dias: 18 },
  { mes: "May", dias: 26 },
  { mes: "Jun", dias: 41 },
  { mes: "Jul", dias: 88 },
  { mes: "Ago", dias: 132 },
  { mes: "Sep", dias: 47 },
];

export const actividadReciente = [
  { id: "act-1", empleadoId: "emp-1", texto: "ha solicitado vacaciones", detalle: "10 – 15 de septiembre", hace: "hace 12 min", tipo: "vacaciones" as const },
  { id: "act-2", empleadoId: "emp-2", texto: "ha fichado su entrada", detalle: "08:57 · Oficina Madrid", hace: "hace 1 h", tipo: "fichaje" as const },
  { id: "act-3", empleadoId: "emp-3", texto: "ha subido un documento", detalle: "Política de teletrabajo 2026", hace: "hace 2 h", tipo: "documento" as const },
  { id: "act-4", empleadoId: "emp-4", texto: "ha completado una evaluación", detalle: "Evaluación Q3 · media 8,8", hace: "hace 4 h", tipo: "evaluacion" as const },
  { id: "act-5", empleadoId: "emp-8", texto: "ha registrado una ausencia", detalle: "Enfermedad · 2 días", hace: "ayer", tipo: "ausencia" as const },
  { id: "act-6", empleadoId: "emp-5", texto: "ha comenzado sus vacaciones", detalle: "1 – 12 de septiembre", hace: "ayer", tipo: "vacaciones" as const },
];

const TURNOS: Record<string, ScheduleShift> = {
  manana: { turno: "Mañana", inicio: "08:00", fin: "17:00" },
  tarde: { turno: "Tarde", inicio: "14:00", fin: "22:00" },
  partido: { turno: "Partido", inicio: "09:00", fin: "18:30" },
  libre: { turno: "Libre", inicio: "—", fin: "—" },
};

export const schedules: Schedule[] = employees.slice(0, 12).map((e, i) => ({
  empleadoId: e.id,
  dias: [0, 1, 2, 3, 4, 5, 6].map((d) => {
    if (d >= 5) return TURNOS['libre']!;
    if (i % 4 === 1) return TURNOS['tarde']!;
    if (i % 4 === 2) return TURNOS['partido']!;
    return TURNOS['manana']!;
  }),
}));

export const clockHistory: ClockEntry[] = employees.slice(0, 10).flatMap((e, i) =>
  ["2026-09-03", "2026-09-02", "2026-09-01", "2026-08-29"].map((fecha, j) => ({
    id: `clk-${i}-${j}`,
    empleadoId: e.id,
    fecha,
    entrada: `0${8 + (j % 2)}:${String(int(2, 58)).padStart(2, "0")}`,
    salida: `1${7 + (j % 2)}:${String(int(2, 58)).padStart(2, "0")}`,
    pausas: int(30, 75),
    horas: 7.5 + Math.round(rand() * 10) / 10,
  })),
);

export const initials = (nombre: string) =>
  nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

const AVATAR_TONES = [
  "bg-chart-1/15 text-chart-1",
  "bg-chart-2/15 text-chart-2",
  "bg-chart-3/15 text-chart-3",
  "bg-chart-4/20 text-chart-4",
  "bg-chart-5/15 text-chart-5",
];

export const avatarTone = (id: string) => {
  const n = id.split("-")[1] ?? "0";
  return AVATAR_TONES[Number(n) % AVATAR_TONES.length]!;
};

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${Number(d)} ${meses[Number(m) - 1]} ${y}`;
};
