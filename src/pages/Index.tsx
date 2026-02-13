import { Users, TrendingUp, TrendingDown, UserPlus, UserMinus, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allMembers, summaryStats, projectedMembers } from "@/data/mock-data";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const newMembers = allMembers.filter((m) => m.status === "new");
const removedMembers = allMembers.filter((m) => m.status === "removed");
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
        <div className="rounded-lg border border-dashed bg-card/50 p-3">
          <h3 className="flex items-center gap-1.5 text-sm font-medium mb-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            March Projections
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1">Est.</Badge>
          </h3>
          <div className="grid gap-3 lg:grid-cols-2">
            {/* At-Risk */}
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-destructive" /> At-Risk ({atRiskMembers.length})
              </p>
              <Table>
                <TableBody>
                  {atRiskMembers.map((m) => (
                    <TableRow key={m.id} className="text-sm">
                      <TableCell className="py-1">
                        <span className="font-medium text-sm">{m.lastName}, {m.firstName}</span>
                      </TableCell>
                      <TableCell className="py-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs cursor-help border-b border-dotted border-muted-foreground/40">{m.reason}</span>
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
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <UserPlus className="h-3 w-3 text-primary" /> Expected ({expectedAdds.length})
              </p>
              <Table>
                <TableBody>
                  {expectedAdds.map((m) => (
                    <TableRow key={m.id} className="text-sm">
                      <TableCell className="py-1">
                        <span className="font-medium text-sm">{m.lastName}, {m.firstName}</span>
                      </TableCell>
                      <TableCell className="py-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs cursor-help border-b border-dotted border-muted-foreground/40">{m.reason}</span>
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
