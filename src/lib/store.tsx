import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as demo from "./demo-data";
import type {
  Absence,
  Announcement,
  ClockEntry,
  DocumentItem,
  Employee,
  Evaluation,
  Notification,
  Schedule,
  ScheduleShift,
  Task,
  VacationRequest,
} from "./demo-data";

export interface DemoUser {
  email: string;
  nombre: string;
  nombreCorto: string;
  puesto: string;
  rol: "admin" | "manager" | "empleado";
}

export const DEMO_USER: DemoUser = {
  email: "admin@peopleflow.es",
  nombre: demo.currentUser.nombre,
  nombreCorto: demo.currentUser.nombreCorto,
  puesto: demo.currentUser.puesto,
  rol: "admin",
};

interface AppState {
  employees: Employee[];
  vacations: VacationRequest[];
  absences: Absence[];
  documents: DocumentItem[];
  tasks: Task[];
  evaluations: Evaluation[];
  announcements: Announcement[];
  notifications: Notification[];
  schedules: Schedule[];
  clockHistory: ClockEntry[];
  events: typeof demo.calendarEvents;
  clockedIn: boolean;
  clockInAt: string | null;
  clockOutAt: string | null;
  breakMinutes: number;
  user: DemoUser | null;
  hydrated: boolean;
  theme: "light" | "dark";
}

interface AppActions {
  addEmployee: (e: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, patch: Partial<Employee>) => void;
  addVacation: (v: Omit<VacationRequest, "id">) => void;
  setVacationStatus: (id: string, estado: VacationRequest["estado"]) => void;
  addAbsence: (a: Omit<Absence, "id">) => void;
  addDocument: (d: Omit<DocumentItem, "id">) => void;
  removeDocument: (id: string) => void;
  addTask: (t: Omit<Task, "id">) => void;
  moveTask: (id: string, estado: Task["estado"]) => void;
  saveEvaluation: (id: string, patch: Partial<Evaluation>) => void;
  addAnnouncement: (a: Omit<Announcement, "id">) => void;
  updateShift: (empleadoId: string, dia: number, shift: ScheduleShift) => void;
  addEvent: (e: Omit<demo.CalendarEvent, "id">) => void;
  toggleClock: () => void;
  addBreak: (minutes: number) => void;
  markNotificationsRead: () => void;
  login: (email: string) => void;
  logout: () => void;
  toggleTheme: () => void;
}

const AppContext = createContext<(AppState & AppActions) | null>(null);

const nid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const nowHHMM = () =>
  new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

export function AppProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(demo.employees);
  const [vacations, setVacations] = useState<VacationRequest[]>(demo.vacations);
  const [absences, setAbsences] = useState<Absence[]>(demo.absences);
  const [documents, setDocuments] = useState<DocumentItem[]>(demo.documents);
  const [tasks, setTasks] = useState<Task[]>(demo.tasks);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(demo.evaluations);
  const [announcements, setAnnouncements] = useState<Announcement[]>(demo.announcements);
  const [notifications, setNotifications] = useState<Notification[]>(demo.notifications);
  const [schedules, setSchedules] = useState<Schedule[]>(demo.schedules);
  const [clockHistory, setClockHistory] = useState<ClockEntry[]>(demo.clockHistory);
  const [events, setEvents] = useState(demo.calendarEvents);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInAt, setClockInAt] = useState<string | null>(null);
  const [clockOutAt, setClockOutAt] = useState<string | null>(null);
  const [breakMinutes, setBreakMinutes] = useState(0);
  const [user, setUser] = useState<DemoUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      if (localStorage.getItem("pf_session")) setUser(DEMO_USER);
      const t = localStorage.getItem("pf_theme");
      if (t === "dark") setTheme("dark");
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const actions: AppActions = useMemo(
    () => ({
      addEmployee: (e) => setEmployees((p) => [{ ...e, id: nid("emp") }, ...p]),
      updateEmployee: (id, patch) =>
        setEmployees((p) => p.map((e) => (e.id === id ? { ...e, ...patch } : e))),
      addVacation: (v) => setVacations((p) => [{ ...v, id: nid("vac") }, ...p]),
      setVacationStatus: (id, estado) =>
        setVacations((p) => p.map((v) => (v.id === id ? { ...v, estado } : v))),
      addAbsence: (a) => setAbsences((p) => [{ ...a, id: nid("aus") }, ...p]),
      addDocument: (d) => setDocuments((p) => [{ ...d, id: nid("doc") }, ...p]),
      removeDocument: (id) => setDocuments((p) => p.filter((d) => d.id !== id)),
      addTask: (t) => setTasks((p) => [{ ...t, id: nid("task") }, ...p]),
      moveTask: (id, estado) =>
        setTasks((p) => p.map((t) => (t.id === id ? { ...t, estado } : t))),
      saveEvaluation: (id, patch) =>
        setEvaluations((p) => p.map((e) => (e.id === id ? { ...e, ...patch } : e))),
      addAnnouncement: (a) => setAnnouncements((p) => [{ ...a, id: nid("an") }, ...p]),
      updateShift: (empleadoId, dia, shift) =>
        setSchedules((p) =>
          p.map((s) =>
            s.empleadoId === empleadoId
              ? { ...s, dias: s.dias.map((d, i) => (i === dia ? shift : d)) }
              : s,
          ),
        ),
      addEvent: (e) => setEvents((p) => [...p, { ...e, id: nid("cal") }]),
      toggleClock: () =>
        setClockedIn((inside) => {
          if (!inside) {
            setClockInAt(nowHHMM());
            setClockOutAt(null);
          } else {
            const out = nowHHMM();
            setClockOutAt(out);
            setClockHistory((h) => [
              {
                id: nid("clk"),
                empleadoId: demo.currentUser.id,
                fecha: demo.HOY,
                entrada: clockInAt ?? "—",
                salida: out,
                pausas: 0,
                horas: 8,
              },
              ...h,
            ]);
          }
          return !inside;
        }),
      addBreak: (m) => setBreakMinutes((p) => p + m),
      markNotificationsRead: () =>
        setNotifications((p) => p.map((n) => ({ ...n, leida: true }))),
      login: (email) => {
        try {
          localStorage.setItem("pf_session", email);
        } catch {
          /* ignore */
        }
        setUser({ ...DEMO_USER, email });
      },
      logout: () => {
        try {
          localStorage.removeItem("pf_session");
        } catch {
          /* ignore */
        }
        setUser(null);
      },
      toggleTheme: () =>
        setTheme((t) => {
          const next = t === "light" ? "dark" : "light";
          try {
            localStorage.setItem("pf_theme", next);
          } catch {
            /* ignore */
          }
          return next;
        }),
    }),
    [clockInAt],
  );

  const value = useMemo(
    () => ({
      employees,
      vacations,
      absences,
      documents,
      tasks,
      evaluations,
      announcements,
      notifications,
      schedules,
      clockHistory,
      events,
      clockedIn,
      clockInAt,
      clockOutAt,
      breakMinutes,
      user,
      hydrated,
      theme,
      ...actions,
    }),
    [
      employees,
      vacations,
      absences,
      documents,
      tasks,
      evaluations,
      announcements,
      notifications,
      schedules,
      clockHistory,
      events,
      clockedIn,
      clockInAt,
      clockOutAt,
      breakMinutes,
      user,
      hydrated,
      theme,
      actions,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}

export function useEmployeeMap() {
  const { employees } = useApp();
  return useMemo(() => {
    const m = new Map<string, Employee>();
    employees.forEach((e) => m.set(e.id, e));
    return m;
  }, [employees]);
}

export const useDelayedReady = (ms = 450) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return ready;
};

export const useCallbackNoop = () => useCallback(() => undefined, []);
