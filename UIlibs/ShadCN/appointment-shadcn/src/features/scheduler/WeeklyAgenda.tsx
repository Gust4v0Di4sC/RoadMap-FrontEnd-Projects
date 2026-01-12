import * as React from "react";
import { cn } from "@/lib/utils";
import type { Appointment, Professional } from "./mock";
import { Badge } from "@/components/ui/badge";

const days = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const times = ["08:00", "09:00", "10:30", "13:00", "14:30", "16:00", "17:30"];

function keyOf(d: string, t: string) {
  return `${d}-${t}`;
}

export function WeeklyAgenda({
  professionals,
  selectedProfessionalId,
  appointments,
  onSlotClick,
}: {
  professionals: Professional[];
  selectedProfessionalId: string;
  appointments: Appointment[];
  onSlotClick: (payload: { dayLabel: string; time: string }) => void;
}) {
  const pro = professionals.find((p) => p.id === selectedProfessionalId);

  // Para simplificar: usamos o diaLabel como chave (sem datas reais nesta primeira versão)
  const map = new Map<string, Appointment>();
  appointments
    .filter((a) => a.professionalId === selectedProfessionalId)
    .forEach((a) => {
      // Vamos mapear pelo "time" e um "fake day" (você pode evoluir para datas reais depois)
      map.set(keyOf("Seg", a.time), a); // seed demo
    });

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b p-4">
        <div>
          <div className="text-sm font-semibold">Agenda semanal</div>
          <div className="text-xs text-muted-foreground">
            {pro ? `${pro.name} • ${pro.specialty}` : "Selecione um profissional"}
          </div>
        </div>
        <Badge variant="secondary">Week view</Badge>
      </div>

      <div className="overflow-auto">
        <div className="min-w-[760px] p-4">
          {/* header */}
          <div className="grid grid-cols-[120px_repeat(5,1fr)] gap-2 text-xs text-muted-foreground">
            <div />
            {days.map((d) => (
              <div key={d} className="px-2 py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="mt-2 grid gap-2">
            {times.map((t) => (
              <div key={t} className="grid grid-cols-[120px_repeat(5,1fr)] gap-2">
                <div className="flex items-center px-2 text-xs text-muted-foreground">{t}</div>

                {days.map((d) => {
                  const appt = map.get(keyOf(d, t));
                  return (
                    <button
                      key={`${d}-${t}`}
                      type="button"
                      onClick={() => onSlotClick({ dayLabel: d, time: t })}
                      className={cn(
                        "h-14 rounded-lg border bg-background px-2 text-left text-xs transition hover:bg-muted",
                        appt && "border-primary/30 bg-primary/5"
                      )}
                    >
                      {appt ? (
                        <div className="space-y-1">
                          <div className="font-semibold">{appt.patientName}</div>
                          <div className="text-muted-foreground">{appt.service}</div>
                          <Badge className="h-5" variant={appt.status === "confirmado" ? "default" : "secondary"}>
                            {appt.status}
                          </Badge>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">Slot livre</div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
