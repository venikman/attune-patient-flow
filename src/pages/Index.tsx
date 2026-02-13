import { Users, TrendingUp, TrendingDown, UserPlus, UserMinus, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allMembers, summaryStats, projectedMembers } from "@/data/mock-data";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const newMembers = allMembers.filter((m) => m.changeType === "new");
const removedMembers = allMembers.filter((m) => m.changeType === "dropped");
const atRiskMembers = projectedMembers.filter((m) => m.type === "at-risk-removal");
const expectedAdds = projectedMembers.filter((m) => m.type === "expected-add");

const confDot = (c: "High" | "Medium" | "Low") => {
  const color = { High: "bg-destructive", Medium: "bg-chart-4", Low: "bg-muted-foreground" }[c];
  return (
    <Tooltip>
      <TooltipTrigger><span className={`inline-block h-2 w-2 rounded-full ${color}`} /></TooltipTrigger>
      <TooltipContent side="top"><p className="text-xs">{c} confidence</p></TooltipContent>
    </Tooltip>
  );
};

export default function Index() {
  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-bold tracking-tight">Attribution Overview</h1>
            <span className="text-sm text-muted-foreground">Feb 2025</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold">{summaryStats.totalActive}</span>
              <span className="text-muted-foreground text-xs">total</span>
            </span>
            <span className="flex items-center gap-1.5">
              {summaryStats.netChange >= 0 ? <TrendingUp className="h-3.5 w-3.5 text-primary" /> : <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
              <span className="font-semibold">{summaryStats.netChange > 0 ? "+" : ""}{summaryStats.netChange}</span>
              <span className="text-muted-foreground text-xs">net</span>
            </span>
          </div>
        </div>

        {/* This Month */}
        <div className="grid gap-3 lg:grid-cols-2">
          {/* Added */}
          <div className="rounded-lg border bg-card p-3">
            <h3 className="flex items-center gap-1.5 text-sm font-medium mb-2">
              <UserPlus className="h-3.5 w-3.5 text-primary" />
              Added <span className="text-muted-foreground font-normal">({newMembers.length})</span>
            </h3>
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="py-1.5 h-auto">Patient</TableHead>
                  <TableHead className="py-1.5 h-auto">Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newMembers.map((m) => (
                  <TableRow key={m.id} className="cursor-pointer text-sm" onClick={() => window.location.href = `/patients/${m.id}`}>
                    <TableCell className="py-1.5">
                      <Link to={`/patients/${m.id}`} className="font-medium hover:underline text-sm">{m.lastName}, {m.firstName}</Link>
                      <span className="ml-1 text-xs text-muted-foreground">{m.age}{m.gender[0]}</span>
                    </TableCell>
                    <TableCell className="py-1.5">
                      <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">{m.changeReason}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Removed */}
          <div className="rounded-lg border bg-card p-3">
            <h3 className="flex items-center gap-1.5 text-sm font-medium mb-2">
              <UserMinus className="h-3.5 w-3.5 text-destructive" />
              Removed <span className="text-muted-foreground font-normal">({removedMembers.length})</span>
            </h3>
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="py-1.5 h-auto">Patient</TableHead>
                  <TableHead className="py-1.5 h-auto">Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {removedMembers.map((m) => (
                  <TableRow key={m.id} className="cursor-pointer text-sm" onClick={() => window.location.href = `/patients/${m.id}`}>
                    <TableCell className="py-1.5">
                      <Link to={`/patients/${m.id}`} className="font-medium hover:underline text-sm">{m.lastName}, {m.firstName}</Link>
                      <span className="ml-1 text-xs text-muted-foreground">{m.age}{m.gender[0]}</span>
                    </TableCell>
                    <TableCell className="py-1.5">
                      <Badge variant="destructive" className="border-0 text-[10px] px-1.5 py-0">{m.changeReason}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Projections */}
        <div className="rounded-lg border border-dashed bg-accent/30 p-3">
          <h3 className="flex items-center gap-1.5 text-sm font-medium mb-3">
            <Clock className="h-3.5 w-3.5 text-primary" />
            March Projections
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1 border-primary/30 text-primary">Est.</Badge>
          </h3>
          <div className="grid gap-3 lg:grid-cols-2">
            {/* At-Risk */}
            <div className="rounded-md bg-destructive/5 border border-destructive/15 p-2">
              <p className="text-xs font-medium text-destructive mb-1.5 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> At-Risk Removals ({atRiskMembers.length})
              </p>
              <Table>
                <TableBody>
                  {atRiskMembers.map((m) => (
                    <TableRow key={m.id} className="text-sm border-destructive/10">
                      <TableCell className="py-1">
                        <span className="font-medium text-sm">{m.lastName}, {m.firstName}</span>
                      </TableCell>
                      <TableCell className="py-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs cursor-help border-b border-dotted border-destructive/40 text-destructive/80">{m.reason}</span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs"><p className="text-xs">{m.evidence}</p></TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-1 text-right w-6">{confDot(m.confidence)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Expected Adds */}
            <div className="rounded-md bg-primary/5 border border-primary/15 p-2">
              <p className="text-xs font-medium text-primary mb-1.5 flex items-center gap-1">
                <UserPlus className="h-3 w-3" /> Expected Adds ({expectedAdds.length})
              </p>
              <Table>
                <TableBody>
                  {expectedAdds.map((m) => (
                    <TableRow key={m.id} className="text-sm border-primary/10">
                      <TableCell className="py-1">
                        <span className="font-medium text-sm">{m.lastName}, {m.firstName}</span>
                      </TableCell>
                      <TableCell className="py-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs cursor-help border-b border-dotted border-primary/40 text-primary/80">{m.reason}</span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs"><p className="text-xs">{m.evidence}</p></TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-1 text-right w-6">{confDot(m.confidence)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
