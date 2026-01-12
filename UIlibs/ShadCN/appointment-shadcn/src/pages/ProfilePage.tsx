import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppButton } from "@/components/ui/app-button";
import { Toaster } from "@/components/ui/sonner";

export default function ProfilePage() {
  const [name, setName] = React.useState("Dr. Sarah Mitchell");
  const [specialty, setSpecialty] = React.useState("General Practitioner");
  const [bio, setBio] = React.useState("Atendo com foco em prevenção, bem-estar e rotina premium.");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4">
          <div className="text-2xl font-bold">Perfil</div>
          <div className="text-sm text-muted-foreground">Edite seus dados e preferências.</div>
        </div>

        <Card className="border/60 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nome</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Especialidade</label>
              <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <div className="flex justify-end gap-2">
              <AppButton intent="ghost" onClick={() => { setName("Dr. Sarah Mitchell"); setSpecialty("General Practitioner"); setBio("Atendo com foco em prevenção, bem-estar e rotina premium."); }}>
                Reset
              </AppButton>
              <AppButton
                onClick={() =>
                  toast({ title: "Perfil salvo", description: "Suas alterações foram aplicadas." })
                }
              >
                Salvar
              </AppButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
