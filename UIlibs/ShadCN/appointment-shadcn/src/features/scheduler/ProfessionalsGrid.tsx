import * as React from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Professional } from "./mock";

export function ProfessionalsGrid({ items }: { items: Professional[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((p) => (
        <Card key={p.id} className="border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{p.name}</div>
                <div className="truncate text-xs text-muted-foreground">{p.specialty}</div>
              </div>

              <Badge variant="secondary" className="gap-1">
                <Star className="h-3.5 w-3.5" />
                {p.rating.toFixed(1)}
              </Badge>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Próxima disponibilidade</div>
              <div className="text-xs font-semibold">{p.nextAvailable}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
