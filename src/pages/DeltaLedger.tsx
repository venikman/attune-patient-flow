import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeftRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { allMembers, trendData, summaryStats } from "@/data/mock-data";
import { Link } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const changeTypeLabel: Record<string, string> = {
  new: "Added",
  dropped: "Dropped",
  changed: "Changed",
  nochange: "No change",
};

const changeTypeColor: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  dropped: "bg-destructive/10 text-destructive",
  changed: "bg-chart-4/20 text-chart-4",
  nochange: "bg-muted text-muted-foreground",
};

// Build event ledger from members that actually changed
const ledgerEntries = allMembers
  .filter((m) => m.changeType !== "nochange")
  .sort((a, b) => (b.changeDate || "").localeCompare(a.changeDate || ""));

export default function DeltaLedger() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Delta Ledger + Parity Trend</h1>
        <p className="text-sm text-muted-foreground">
          Event-sourced roster diff — normalized indicators with parity window
        </p>
      </div>

      {/* Parity Trend Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Membership Parity Trend
            <span className="text-xs text-muted-foreground font-normal ml-auto">Same window / same budget rules</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} domain={["dataMin - 2", "dataMax + 2"]} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area
                  type="monotone"
                  dataKey="members"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-3 text-sm">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold">+{summaryStats.newThisMonth}</span>
              <span className="text-xs text-muted-foreground">added</span>
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              <span className="font-semibold">-{summaryStats.removedThisMonth}</span>
              <span className="text-xs text-muted-foreground">dropped</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Minus className="h-3.5 w-3.5" />
              <span className="font-semibold">{summaryStats.netChange > 0 ? "+" : ""}{summaryStats.netChange}</span>
              <span className="text-xs text-muted-foreground">net</span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Event Ledger */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-primary" />
            Event Ledger
            <Badge variant="outline" className="text-[10px] ml-1">
              {ledgerEntries.length} events
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="py-1.5 h-auto">Date</TableHead>
                <TableHead className="py-1.5 h-auto">Patient</TableHead>
                <TableHead className="py-1.5 h-auto">Change Type</TableHead>
                <TableHead className="py-1.5 h-auto">Reason</TableHead>
                <TableHead className="py-1.5 h-auto">Period</TableHead>
                <TableHead className="py-1.5 h-auto">Inactive</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledgerEntries.map((m) => (
                <TableRow key={m.id} className="text-sm">
                  <TableCell className="py-1.5 font-mono text-xs">{m.changeDate || "—"}</TableCell>
                  <TableCell className="py-1.5">
                    <Link to={`/patients/${m.id}`} className="font-medium hover:underline">
                      {m.lastName}, {m.firstName}
                    </Link>
                  </TableCell>
                  <TableCell className="py-1.5">
                    <Badge className={`${changeTypeColor[m.changeType]} border-0 text-[10px] px-1.5 py-0`}>
                      {changeTypeLabel[m.changeType]}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-1.5 text-xs text-muted-foreground">{m.changeReason || "—"}</TableCell>
                  <TableCell className="py-1.5 text-xs font-mono">{m.attributionPeriodStart} → {m.attributionPeriodEnd}</TableCell>
                  <TableCell className="py-1.5">
                    {m.inactive ? (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0 border-0">Yes</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">No</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mismatch note */}
      <div className="rounded-lg border border-dashed border-chart-4/40 bg-chart-4/5 p-3 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">⚠ Interoperability Note:</span>{" "}
        Fine-grained "Reason" labels (e.g. PCP selection, moved out of area) are <em>not</em> represented by base{" "}
        <code className="text-xs bg-muted px-1 rounded">atr-changetype</code> codes. Model as an explicit extension/value set for interoperability.
      </div>

      {/* FPF Note */}
      <div className="rounded-lg border border-dashed border-primary/30 bg-accent/30 p-3 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">FPF — Parity:</span> Normalize, indicatorize, compare with explicit parity. Avoids "net +3" hiding churn structure.
      </div>
    </div>
  );
}
