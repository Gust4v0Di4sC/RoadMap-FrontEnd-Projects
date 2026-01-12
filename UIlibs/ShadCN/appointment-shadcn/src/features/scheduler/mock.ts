export type Professional = {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
  rating: number;
  nextAvailable: string;
};

export const professionals: Professional[] = [
  { id: "p1", name: "Dra. Sarah Mitchell", specialty: "Clínica geral", rating: 4.9, nextAvailable: "Hoje 14:30" },
  { id: "p2", name: "Dr. Lucas Almeida", specialty: "Dermatologia", rating: 4.8, nextAvailable: "Amanhã 09:00" },
  { id: "p3", name: "Ana Beatriz", specialty: "Estética", rating: 4.7, nextAvailable: "Hoje 16:00" },
];

export type Appointment = {
  id: string;
  dateISO: string; // yyyy-MM-dd
  time: string; // "09:00"
  professionalId: string;
  patientName: string;
  service: string;
  status: "confirmado" | "pendente";
};

export const appointmentsSeed: Appointment[] = [
  { id: "a1", dateISO: "2026-01-12", time: "09:00", professionalId: "p1", patientName: "Mariana", service: "Consulta", status: "confirmado" },
  { id: "a2", dateISO: "2026-01-12", time: "10:30", professionalId: "p2", patientName: "Carlos", service: "Retorno", status: "pendente" },
];
