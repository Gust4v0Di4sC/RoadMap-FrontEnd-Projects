import * as React from "react";
import { professionals, appointmentsSeed, type Appointment } from "@/features/scheduler/mock";
import { BookAppointmentDialog } from "@/features/scheduler/BookAppointmentDialog";
import { ProfessionalsGrid } from "@/features/scheduler/ProfessionalsGrid";
import { OccupancyChartCard } from "@/features/scheduler/OccupancyChartCard";
import { WeeklyAgenda } from "@/features/scheduler/WeeklyAgenda";
import { Separator } from "@/components/ui/separator";
import { AppButton } from "@/components/ui/app-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SchedulerDashboardPage() {
  const [selectedProfessionalId, setSelectedProfessionalId] = React.useState(professionals[0].id);
  const [appointments, setAppointments] = React.useState<Appointment[]>(appointmentsSeed);

  return (
    <div className="min-h-screen bg-background">
      {/* Top header */}
      <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl gradient-brand" />
            <div>
              <div className="text-sm font-semibold">HealthCare Clinic</div>
              <div className="text-xs text-muted-foreground">Scheduling</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">Premium</Badge>
            <BookAppointmentDialog
              professionals={professionals}
              onBooked={({ date, time, professionalId, patientName, service, notes }) => {
                const iso = date.toISOString().slice(0, 10);
                setAppointments((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    dateISO: iso,
                    time,
                    professionalId,
                    patientName,
                    service,
                    status: "confirmado",
                  },
                ]);
                setSelectedProfessionalId(professionalId);
              }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Welcome */}
        <div>
          <div className="text-2xl font-bold">Agenda da semana</div>
          <div className="text-sm text-muted-foreground">
            Controle total de UI com shadcn + Tailwind (modo SaaS premium).
          </div>
        </div>

        <Separator />

        {/* Professionals */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Profissionais</div>
              <div className="text-xs text-muted-foreground">Selecione para filtrar a agenda</div>
            </div>

            <div className="flex gap-2">
              {professionals.map((p) => (
                <AppButton
                  key={p.id}
                  intent={p.id === selectedProfessionalId ? "primary" : "ghost"}
                  className="h-9"
                  onClick={() => setSelectedProfessionalId(p.id)}
                >
                  {p.name.split(" ")[0]}
                </AppButton>
              ))}
            </div>
          </div>

          <ProfessionalsGrid items={professionals} />
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WeeklyAgenda
              professionals={professionals}
              selectedProfessionalId={selectedProfessionalId}
              appointments={appointments}
              onSlotClick={({ dayLabel, time }) => {
                // aqui você pode abrir o Dialog já preenchendo horário/dia
                // por enquanto só demo:
                console.log("clicked slot", dayLabel, time);
              }}
            />
          </div>

          <div className="space-y-6">
            <OccupancyChartCard />

            <Card className="border/60 shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm font-semibold">Atalhos</div>
                <div className="text-xs text-muted-foreground">Ações rápidas</div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <AppButton intent="ghost">Pacientes</AppButton>
                  <AppButton intent="ghost">Pagamentos</AppButton>
                  <AppButton intent="ghost">Relatórios</AppButton>
                  <AppButton intent="ghost">Config</AppButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
