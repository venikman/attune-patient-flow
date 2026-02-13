import { useState, useMemo } from "react";
import { Code, Copy, Check, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface FhirInspectorProps {
  data: unknown;
  title?: string;
}

function highlightJson(json: string): React.ReactNode[] {
  const lines = json.split("\n");
  return lines.map((line, i) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    // Match patterns: keys, strings, numbers, booleans, null
    const regex = /("(?:\\.|[^"\\])*")\s*:|("(?:\\.|[^"\\])*")|((?:-?\d+\.?\d*(?:[eE][+-]?\d+)?))|(\btrue\b|\bfalse\b)|(\bnull\b)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      // Add any plain text before this match
      if (match.index > lastIndex) {
        parts.push(<span key={key++}>{line.slice(lastIndex, match.index)}</span>);
      }

      if (match[1] !== undefined) {
        // Key (quoted string followed by colon)
        parts.push(
          <span key={key++} className="text-chart-1">{match[1]}</span>
        );
        parts.push(<span key={key++}>:</span>);
      } else if (match[2] !== undefined) {
        // String value
        parts.push(
          <span key={key++} className="text-chart-4">{match[2]}</span>
        );
      } else if (match[3] !== undefined) {
        // Number
        parts.push(
          <span key={key++} className="text-chart-2">{match[3]}</span>
        );
      } else if (match[4] !== undefined) {
        // Boolean
        parts.push(
          <span key={key++} className="text-chart-5">{match[4]}</span>
        );
      } else if (match[5] !== undefined) {
        // Null
        parts.push(
          <span key={key++} className="text-muted-foreground">{match[5]}</span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < line.length) {
      parts.push(<span key={key++}>{line.slice(lastIndex)}</span>);
    }

    return (
      <div key={i} className="leading-relaxed">
        {parts.length > 0 ? parts : line}
      </div>
    );
  });
}

export function FhirInspector({ data, title = "FHIR Inspector" }: FhirInspectorProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const json = JSON.stringify(data, null, 2);
  const highlighted = useMemo(() => highlightJson(json), [json]);

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
          <pre className="overflow-x-auto p-4 text-xs font-mono bg-muted/50 max-h-[500px] overflow-y-auto">
            {highlighted}
          </pre>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
