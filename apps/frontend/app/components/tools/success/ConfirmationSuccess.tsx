import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ConfirmationSuccessProps {
  data: {
    confirmed: boolean;
  };
}

export function ConfirmationSuccess({ data }: ConfirmationSuccessProps) {
  if (!data.confirmed) return null;

  return (
    <Card className="bg-gradient-to-br from-background to-background border-border">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium">[action confirmed]</h3>
            <p className="text-sm text-muted-foreground mt-1">
              [proceeding with requested action]
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
