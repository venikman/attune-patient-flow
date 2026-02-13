import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Grid3X3, Sparkles, BarChart3, Layers } from "lucide-react";
import { allMembers, allPlans } from "@/data/mock-data";

// Descriptors: Payer × Age Band
const ageBands = ["<40", "40-54", "55-64", "65+"] as const;
type AgeBand = typeof ageBands[number];

function getAgeBand(age: number): AgeBand {
  if (age < 40) return "<40";
  if (age < 55) return "40-54";
  if (age < 65) return "55-64";
  return "65+";
}

const payers = [...new Set(allPlans.map((p) => p.payer))];

interface NicheCell {
  payer: string;
  ageBand: AgeBand;
  members: typeof allMembers;
  quality: number;      // avg member-months remaining
  novelty: boolean;     // newly occupied (has "new" members)
  isSteppingStone: boolean;
}

export default function NqdMap() {
  const activeMembers = allMembers.filter((m) => !m.inactive);

  const grid = useMemo(() => {
    const cells: NicheCell[] = [];
    for (const payer of payers) {
      for (const band of ageBands) {
        const members = activeMembers.filter(
          (m) => m.plan.payer === payer && getAgeBand(m.age) === band
        );
        // Quality: count as proxy
        const quality = members.length;
        // Novelty: has newly added members
        const novelty = members.some((m) => m.changeType === "new");
        cells.push({ payer, ageBand: band, members, quality, novelty, isSteppingStone: false });
      }
    }
    // Mark stepping stones: empty or very small cells adjacent to populated ones
    cells.forEach((c) => {
      if (c.quality === 0) {
        const payerIdx = payers.indexOf(c.payer);
        const bandIdx = ageBands.indexOf(c.ageBand);
        const neighbors = cells.filter((n) => {
          const pi = payers.indexOf(n.payer);
          const bi = ageBands.indexOf(n.ageBand);
          return Math.abs(pi - payerIdx) + Math.abs(bi - bandIdx) === 1 && n.quality > 0;
        });
        if (neighbors.length > 0) c.isSteppingStone = true;
      }
    });
    return cells;
  }, []);

  const maxQuality = Math.max(...grid.map((c) => c.quality), 1);
  const totalCells = grid.length;
  const occupiedCells = grid.filter((c) => c.quality > 0).length;
  const novelCells = grid.filter((c) => c.novelty).length;
  const diversity = Math.round((occupiedCells / totalCells) * 100);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">NQD Illumination Map</h1>
          <p className="text-sm text-muted-foreground">
            Novelty–Quality–Diversity portfolio view — prevent local maxima from narrow segments
          </p>
        </div>

        {/* NQD Summary */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 py-3">
              <div className="rounded-lg bg-chart-4/10 p-2"><Sparkles className="h-4 w-4 text-chart-4" /></div>
              <div>
                <p className="text-lg font-bold">{novelCells}</p>
                <p className="text-xs text-muted-foreground">Novel Niches</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-3">
              <div className="rounded-lg bg-primary/10 p-2"><BarChart3 className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-lg font-bold">{activeMembers.length}</p>
                <p className="text-xs text-muted-foreground">Total Quality (Members)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-3">
              <div className="rounded-lg bg-accent p-2"><Layers className="h-4 w-4 text-accent-foreground" /></div>
              <div>
                <p className="text-lg font-bold">{diversity}%</p>
                <p className="text-xs text-muted-foreground">Diversity (Cell Coverage)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Illumination Grid */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Grid3X3 className="h-4 w-4 text-primary" />
              Niche Grid — Payer × Age Band
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-primary/80 inline-block" /> Quality (member count)</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border-2 border-chart-4 inline-block" /> Novelty (new members)</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm border-2 border-dashed border-primary/40 inline-block" /> Stepping stone</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-xs text-muted-foreground py-2 px-3 text-left font-medium">Payer ↓ / Age →</th>
                    {ageBands.map((b) => (
                      <th key={b} className="text-xs text-muted-foreground py-2 px-3 text-center font-medium">{b}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payers.map((payer) => (
                    <tr key={payer}>
                      <td className="text-sm font-medium py-2 px-3 border-t border-border">{payer}</td>
                      {ageBands.map((band) => {
                        const cell = grid.find((c) => c.payer === payer && c.ageBand === band)!;
                        const intensity = cell.quality / maxQuality;
                        return (
                          <td key={band} className="py-2 px-3 border-t border-border">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`
                                    relative flex items-center justify-center rounded-lg h-16 w-full min-w-[80px] transition-all cursor-default
                                    ${cell.quality > 0
                                      ? ""
                                      : cell.isSteppingStone
                                        ? "border-2 border-dashed border-primary/40 bg-primary/5"
                                        : "bg-muted/30"
                                    }
                                    ${cell.novelty ? "ring-2 ring-chart-4 ring-offset-1 ring-offset-background" : ""}
                                  `}
                                  style={cell.quality > 0 ? {
                                    backgroundColor: `hsl(var(--primary) / ${Math.max(0.08, intensity * 0.6)})`,
                                  } : undefined}
                                >
                                  <div className="text-center">
                                    <p className={`text-lg font-bold ${cell.quality > 0 ? "text-primary" : "text-muted-foreground/40"}`}>
                                      {cell.quality}
                                    </p>
                                    {cell.novelty && (
                                      <Sparkles className="h-3 w-3 text-chart-4 absolute top-1 right-1" />
                                    )}
                                    {cell.isSteppingStone && (
                                      <p className="text-[9px] text-primary/60 font-medium">stepping stone</p>
                                    )}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="max-w-xs">
                                <div className="text-xs space-y-1">
                                  <p className="font-medium">{payer} · {band}</p>
                                  <p>Members: {cell.quality}</p>
                                  <p>Novelty: {cell.novelty ? "Yes (new attributions)" : "No"}</p>
                                  {cell.isSteppingStone && <p className="text-primary">Stepping stone — expandable niche</p>}
                                  {cell.members.length > 0 && (
                                    <p className="text-muted-foreground">
                                      {cell.members.slice(0, 3).map((m) => `${m.lastName}`).join(", ")}
                                      {cell.members.length > 3 ? ` +${cell.members.length - 3} more` : ""}
                                    </p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Definitions */}
        <Card>
          <CardContent className="py-4">
            <div className="grid gap-4 sm:grid-cols-3 text-sm">
              <div>
                <p className="font-semibold text-foreground flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-chart-4" /> Novelty</p>
                <p className="text-xs text-muted-foreground mt-1">Newly occupied niches or outlier segments from this month's attribution changes.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground flex items-center gap-1"><BarChart3 className="h-3.5 w-3.5 text-primary" /> Quality</p>
                <p className="text-xs text-muted-foreground mt-1">Chosen outcome indicator per niche — member count as value proxy.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> Diversity</p>
                <p className="text-xs text-muted-foreground mt-1">Coverage of grid cells. Higher = more balanced portfolio across segments.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FPF Note */}
        <div className="rounded-lg border border-dashed border-primary/30 bg-accent/30 p-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">FPF — NQD:</span> Portfolio view prevents local maxima (all growth from one narrow segment). Stepping-stone bets expand reachable niches. No single score; evaluate on all three axes.
        </div>
      </div>
    </TooltipProvider>
  );
}
