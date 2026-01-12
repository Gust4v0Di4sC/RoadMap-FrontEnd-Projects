import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { AppButton } from "@/components/ui/app-button";
import type { Professional } from "./mock";

type Props = {
  professionals: Professional[];
  onBooked: (payload: {
    date: Date;
    time: string;
    professionalId: string;
    patientName: string;
    service: string;
    notes?: string;
  }) => void;
};

const times = ["08:00", "09:00", "10:30", "13:00", "14:30", "16:00", "17:30"];

export function BookAppointmentDialog({ professionals, onBooked }: Props) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState(times[1]);
  const [patientName, setPatientName] = React.useState("");
  const [service, setService] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [professionalId, setProfessionalId] = React.useState(professionals[0]?.id ?? "");

  const pro = professionals.find((p) => p.id === professionalId);

  function submit() {
    if (!date || !patientName || !service || !professionalId) {
      Toaster({ title: "Preencha os campos obrigatórios", description: "Selecione data, profissional e informe paciente/serviço." });
      return;
    }

    onBooked({ date, time, professionalId, patientName, service, notes });
    Toaster({ title: "Agendamento criado", description: `${patientName} • ${service} • ${format(date, "dd/MM", { locale: ptBR })} ${time}` });

    setOpen(false);
    setPatientName("");
    setService("");
    setNotes("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AppButton className="gradient-brand text-white shadow-sm">Novo agendamento</AppButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Agendar atendimento</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Professional select (Command) */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Profissional</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm"
                >
                  <span className="truncate">
                    {pro ? `${pro.name} • ${pro.specialty}` : "Selecionar"}
                  </span>
                  <ChevronsUpDown className="h-4 w-4 opacity-60" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar profissional..." />
                  <CommandEmpty>Nenhum encontrado.</CommandEmpty>
                  <CommandGroup>
                    {professionals.map((p) => (
                      <CommandItem
                        key={p.id}
                        value={p.name}
                        onSelect={() => setProfessionalId(p.id)}
                      >
                        <Check className={cn("mr-2 h-4 w-4", professionalId === p.id ? "opacity-100" : "opacity-0")} />
                        <span className="truncate">{p.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{p.specialty}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Data</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex h-10 w-full items-center gap-2 rounded-md border bg-background px-3 text-sm"
                  >
                    <CalendarIcon className="h-4 w-4 opacity-70" />
                    {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} autoFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Horário</label>
              <div className="grid grid-cols-3 gap-2">
                {times.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={cn(
                      "h-10 rounded-md border text-sm",
                      t === time ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Patient + Service */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Paciente</label>
              <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Nome do paciente" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Serviço</label>
              <Input value={service} onChange={(e) => setService(e.target.value)} placeholder="Ex: Consulta, Barba, Limpeza" />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Observações (opcional)</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas internas..." />
          </div>

          <div className="flex justify-end gap-2">
            <AppButton intent="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </AppButton>
            <AppButton onClick={submit}>Confirmar</AppButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
