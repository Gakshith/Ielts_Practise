import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function Probe() {
  return (
    <main className="p-8 bg-bg text-text">
      <Card className="p-6">
        <Badge tone="accent">probe</Badge>
        <Button variant="accent">go</Button>
        <p className="text-text-muted border-border-strong shadow-raised rounded-xl">x</p>
      </Card>
    </main>
  );
}
