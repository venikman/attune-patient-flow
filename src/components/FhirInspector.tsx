import { useState } from "react";
import { Code, Copy, Check, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface FhirInspectorProps {
  data: unknown;
  title?: string;
}

export function FhirInspector({ data, title = "FHIR Inspector" }: FhirInspectorProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const json = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-8 rounded-lg border bg-card">
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <Code className="h-4 w-4" />
          <span>{title}</span>
          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="relative border-t">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-7 w-7"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed font-mono bg-muted/50 max-h-[500px] overflow-y-auto">
            {json}
          </pre>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
