import { useState, useMemo, useCallback } from "react";
import { Code, Copy, Check, ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FhirInspectorProps {
  data: unknown;
  title?: string;
}

interface JsonNodeProps {
  keyName?: string;
  value: unknown;
  depth: number;
  defaultExpanded?: boolean;
  searchTerm: string;
  isLast: boolean;
}

function matchesSearch(value: unknown, search: string): boolean {
  if (!search) return false;
  const lower = search.toLowerCase();
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).toLowerCase().includes(lower);
  }
  if (value === null) return "null".includes(lower);
  if (Array.isArray(value)) return value.some((v) => matchesSearch(v, search));
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).some(
      ([k, v]) => k.toLowerCase().includes(lower) || matchesSearch(v, search)
    );
  }
  return false;
}

function highlightText(text: string, search: string, className: string) {
  if (!search) return <span className={className}>{text}</span>;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(search.toLowerCase());
  if (idx === -1) return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      {text.slice(0, idx)}
      <mark className="bg-primary/30 text-foreground rounded-sm px-0.5">{text.slice(idx, idx + search.length)}</mark>
      {text.slice(idx + search.length)}
    </span>
  );
}

function JsonNode({ keyName, value, depth, defaultExpanded = true, searchTerm, isLast }: JsonNodeProps) {
  const isExpandable = (typeof value === "object" && value !== null);
  const shouldAutoExpand = searchTerm ? matchesSearch(value, searchTerm) : defaultExpanded;
  const [expanded, setExpanded] = useState(shouldAutoExpand);

  // Re-expand when search changes
  const [prevSearch, setPrevSearch] = useState(searchTerm);
  if (prevSearch !== searchTerm) {
    setPrevSearch(searchTerm);
    if (searchTerm && matchesSearch(value, searchTerm)) {
      setExpanded(true);
    }
  }

  const comma = isLast ? "" : ",";
  const indent = depth * 16;

  if (!isExpandable) {
    let rendered: React.ReactNode;
    if (typeof value === "string") {
      rendered = highlightText(`"${value}"`, searchTerm, "text-chart-4");
    } else if (typeof value === "number") {
      rendered = highlightText(String(value), searchTerm, "text-chart-2");
    } else if (typeof value === "boolean") {
      rendered = <span className="text-chart-5">{String(value)}</span>;
    } else {
      rendered = <span className="text-muted-foreground">null</span>;
    }

    return (
      <div style={{ paddingLeft: indent }} className="leading-6 hover:bg-muted/40 transition-colors">
        {keyName !== undefined && (
          <>
            {highlightText(`"${keyName}"`, searchTerm, "text-chart-1")}
            <span className="text-foreground">: </span>
          </>
        )}
        {rendered}
        <span className="text-foreground">{comma}</span>
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries = isArray ? (value as unknown[]) : Object.entries(value as Record<string, unknown>);
  const openBracket = isArray ? "[" : "{";
  const closeBracket = isArray ? "]" : "}";
  const count = entries.length;

  if (count === 0) {
    return (
      <div style={{ paddingLeft: indent }} className="leading-6 hover:bg-muted/40 transition-colors">
        {keyName !== undefined && (
          <>
            {highlightText(`"${keyName}"`, searchTerm, "text-chart-1")}
            <span className="text-foreground">: </span>
          </>
        )}
        <span className="text-foreground">{openBracket}{closeBracket}{comma}</span>
      </div>
    );
  }

  return (
    <>
      <div
        style={{ paddingLeft: indent }}
        className="leading-6 hover:bg-muted/40 transition-colors cursor-pointer select-none flex items-center"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown className="h-3 w-3 text-muted-foreground mr-1 shrink-0" />
        ) : (
          <ChevronRight className="h-3 w-3 text-muted-foreground mr-1 shrink-0" />
        )}
        {keyName !== undefined && (
          <>
            {highlightText(`"${keyName}"`, searchTerm, "text-chart-1")}
            <span className="text-foreground">: </span>
          </>
        )}
        <span className="text-foreground">{openBracket}</span>
        {!expanded && (
          <>
            <span className="text-muted-foreground mx-1 text-[10px]">
              {count} {count === 1 ? "item" : "items"}
            </span>
            <span className="text-foreground">{closeBracket}{comma}</span>
          </>
        )}
      </div>
      {expanded && (
        <>
          {isArray
            ? (value as unknown[]).map((item, i) => (
                <JsonNode
                  key={i}
                  value={item}
                  depth={depth + 1}
                  defaultExpanded={depth < 2}
                  searchTerm={searchTerm}
                  isLast={i === count - 1}
                />
              ))
            : Object.entries(value as Record<string, unknown>).map(([k, v], i) => (
                <JsonNode
                  key={k}
                  keyName={k}
                  value={v}
                  depth={depth + 1}
                  defaultExpanded={depth < 2}
                  searchTerm={searchTerm}
                  isLast={i === count - 1}
                />
              ))}
          <div style={{ paddingLeft: indent }} className="leading-6">
            <span className="text-foreground ml-4">{closeBracket}{comma}</span>
          </div>
        </>
      )}
    </>
  );
}

export function FhirInspector({ data, title = "FHIR Inspector" }: FhirInspectorProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
        <div className="border-t">
          <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <Input
              placeholder="Search keys or values…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-7 text-xs border-0 bg-transparent shadow-none focus-visible:ring-0 px-0"
            />
            {searchTerm && (
              <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={() => setSearchTerm("")}>
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
          <pre className="overflow-x-auto p-4 text-xs font-mono bg-muted/50 max-h-[500px] overflow-y-auto">
            <JsonNode value={data} depth={0} defaultExpanded={true} searchTerm={searchTerm} isLast={true} />
          </pre>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
