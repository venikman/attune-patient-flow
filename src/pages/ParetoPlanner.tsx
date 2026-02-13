import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Target, AlertTriangle, UserPlus, TrendingUp } from "lucide-react";
import { projectedMembers } from "@/data/mock-data";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell, ReferenceLine } from "recharts";

// Synthetic objectives for Pareto demo
function deriveObjectives(m: typeof projectedMembers[0]) {
  const confScore = { High: 0.9, Medium: 0.6, Low: 0.3 }[m.confidence];
  // Expected retained member-months (higher = better)
  const retainedMonths = m.type === "at-risk-removal"
    ? Math.round((1 - confScore) * 12)
    : Math.round(confScore * 10);
  // Staff minutes required (lower = better)
  const staffMinutes = m.type === "at-risk-removal"
    ? Math.round(confScore * 60 + 15)
    : Math.round((1 - confScore) * 30 + 10);
  // Clinical risk tier (1-3)
  const riskTier = m.age > 65 ? 3 : m.age > 50 ? 2 : 1;
  return { retainedMonths, staffMinutes, riskTier };
}

const candidates = projectedMembers.map((m) => {
  const obj = deriveObjectives(m);
  return { ...m, ...obj };
});

// Simple Pareto: non-dominated on (retainedMonths↑, -staffMinutes↑)
function isPareto(c: typeof candidates[0]) {
  return !candidates.some(
    (o) => o.id !== c.id && o.retainedMonths >= c.retainedMonths && o.staffMinutes <= c.staffMinutes &&
      (o.retainedMonths > c.retainedMonths || o.staffMinutes < c.staffMinutes)
  );
}

const paretoSet = new Set(candidates.filter(isPareto).map((c) => c.id));

export default function ParetoPlanner() {
  const [selected, setSelected] = useState<Set<string>>(new Set(paretoSet));

  const totalMinutes = useMemo(
    () => candidates.filter((c) => selected.has(c.id)).reduce((s, c) => s + c.staffMinutes, 0),
    [selected]
  );
  const totalMonths = useMemo(
    () => candidates.filter((c) => selected.has(c.id)).reduce((s, c) => s + c.retainedMonths, 0),
    [selected]
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const scatterData = candidates.map((c) => ({
    x: c.staffMinutes,
    y: c.retainedMonths,
    name: `${c.lastName}, ${c.firstName}`,
    pareto: paretoSet.has(c.id),
    selected: selected.has(c.id),
    id: c.id,
  }));

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Pareto-Front Action Planner</h1>
          <p className="text-sm text-muted-foreground">
            Reconciliation &amp; outreach without a fake score — set-return selection on a Pareto frontier
          </p>
        </div>

        {/* Summary */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 py-3">
              <div className="rounded-lg bg-primary/10 p-2"><Target className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-lg font-bold">{selected.size}</p>
                <p className="text-xs text-muted-foreground">Selected Actions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-3">
              <div className="rounded-lg bg-chart-4/10 p-2"><TrendingUp className="h-4 w-4 text-chart-4" /></div>
              <div>
                <p className="text-lg font-bold">{totalMonths}</p>
                <p className="text-xs text-muted-foreground">Est. Member-Months</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-3">
              <div className="rounded-lg bg-destructive/10 p-2"><AlertTriangle className="h-4 w-4 text-destructive" /></div>
              <div>
                <p className="text-lg font-bold">{totalMinutes} min</p>
                <p className="text-xs text-muted-foreground">Staff Budget Required</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scatter plot */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Objective Space
              <span className="text-xs text-muted-foreground font-normal ml-2">
                ● Pareto front = highlighted — no hidden weighting
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Staff Minutes"
                    tick={{ fontSize: 11 }}
                    label={{ value: "Staff Minutes →", position: "bottom", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Retained Member-Months"
                    tick={{ fontSize: 11 }}
                    label={{ value: "Member-Months ↑", angle: -90, position: "insideLeft", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(value: number, name: string) => [value, name === "x" ? "Staff min" : "Mbr-months"]}
                    labelFormatter={(_: any, payload: any[]) => payload?.[0]?.payload?.name || ""}
                  />
                  <Scatter data={scatterData}>
                    {scatterData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.pareto ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                        fillOpacity={entry.selected ? 1 : 0.3}
                        stroke={entry.selected ? "hsl(var(--primary))" : "none"}
                        strokeWidth={entry.selected ? 2 : 0}
                        r={entry.pareto ? 8 : 5}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Action Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Candidate Actions — Select Portfolio Under Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="py-1.5 h-auto w-8"></TableHead>
                  <TableHead className="py-1.5 h-auto">Patient</TableHead>
                  <TableHead className="py-1.5 h-auto">Type</TableHead>
                  <TableHead className="py-1.5 h-auto">Reason</TableHead>
                  <TableHead className="py-1.5 h-auto text-right">Mbr-Months</TableHead>
                  <TableHead className="py-1.5 h-auto text-right">Staff Min</TableHead>
                  <TableHead className="py-1.5 h-auto text-right">Risk Tier</TableHead>
                  <TableHead className="py-1.5 h-auto">Frontier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((c) => (
                  <TableRow
                    key={c.id}
                    className={`text-sm cursor-pointer ${selected.has(c.id) ? "bg-accent/50" : ""}`}
                    onClick={() => toggle(c.id)}
                  >
                    <TableCell className="py-1.5">
                      <Checkbox checked={selected.has(c.id)} onCheckedChange={() => toggle(c.id)} />
                    </TableCell>
                    <TableCell className="py-1.5 font-medium">{c.lastName}, {c.firstName}</TableCell>
                    <TableCell className="py-1.5">
                      {c.type === "at-risk-removal" ? (
                        <Badge className="bg-destructive/10 text-destructive border-0 text-[10px] px-1.5 py-0">At-Risk</Badge>
                      ) : (
                        <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">Expected Add</Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-1.5 text-xs text-muted-foreground">{c.reason}</TableCell>
                    <TableCell className="py-1.5 text-right font-semibold">{c.retainedMonths}</TableCell>
                    <TableCell className="py-1.5 text-right">{c.staffMinutes}</TableCell>
                    <TableCell className="py-1.5 text-right">{c.riskTier}</TableCell>
                    <TableCell className="py-1.5">
                      {paretoSet.has(c.id) ? (
                        <Tooltip>
                          <TooltipTrigger><Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0">★</Badge></TooltipTrigger>
                          <TooltipContent><p className="text-xs">On the Pareto frontier (non-dominated)</p></TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* FPF Note */}
        <div className="rounded-lg border border-dashed border-primary/30 bg-accent/30 p-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">FPF — Pareto Portfolio:</span> Set-return selection on a Pareto frontier. No hidden weighting; tie-breakers are explicit. Final lists disallow reconciliation operations (member-add/remove).
        </div>
      </div>
    </TooltipProvider>
  );
}
