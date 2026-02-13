import { Users, TrendingUp, TrendingDown, UserPlus, UserMinus, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allMembers, summaryStats, projectedMembers } from "@/data/mock-data";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const newMembers = allMembers.filter((m) => m.status === "new");
const removedMembers = allMembers.filter((m) => m.status === "removed");
const atRiskMembers = projectedMembers.filter((m) => m.type === "at-risk-removal");
const expectedAdds = projectedMembers.filter((m) => m.type === "expected-add");

const confidenceBadge = (confidence: "High" | "Medium" | "Low") => {
  const styles = {
    High: "bg-destructive/10 text-destructive",
    Medium: "bg-chart-4/20 text-chart-4",
    Low: "bg-muted text-muted-foreground",
  };
  return <Badge className={`${styles[confidence]} border-0 text-xs`}>{confidence}</Badge>;
};

export default function Index() {
  return (
    <div className="space-y-6">
      {/* Compact Header */}
      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attribution Overview</h1>
          <p className="text-muted-foreground">February 2025</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-semibold text-lg">{summaryStats.totalActive}</span>
            <span className="text-muted-foreground">attributed</span>
          </div>
          <div className="flex items-center gap-2">
            {summaryStats.netChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-primary" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className="font-semibold text-lg">
              {summaryStats.netChange > 0 ? "+" : ""}{summaryStats.netChange}
            </span>
            <span className="text-muted-foreground">net change</span>
          </div>
        </div>
      </div>

      {/* This Month: Added & Removed */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlus className="h-4 w-4 text-primary" />
              Added ({newMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newMembers.map((m) => (
                  <TableRow key={m.id} className="cursor-pointer" onClick={() => window.location.href = `/patients/${m.id}`}>
                    <TableCell>
                      <Link to={`/patients/${m.id}`} className="font-medium hover:underline">
                        {m.lastName}, {m.firstName}
                      </Link>
                      <span className="ml-1 text-xs text-muted-foreground">{m.age}{m.gender[0]}</span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{m.memberId}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-0 text-xs">{m.changeReason}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <UserMinus className="h-4 w-4 text-destructive" />
              Removed ({removedMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {removedMembers.map((m) => (
                  <TableRow key={m.id} className="cursor-pointer" onClick={() => window.location.href = `/patients/${m.id}`}>
                    <TableCell>
                      <Link to={`/patients/${m.id}`} className="font-medium hover:underline">
                        {m.lastName}, {m.firstName}
                      </Link>
                      <span className="ml-1 text-xs text-muted-foreground">{m.age}{m.gender[0]}</span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{m.memberId}</TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="border-0 text-xs">{m.changeReason}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Next Month Projections */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">March 2025 Projections</h2>
          <Badge variant="outline" className="text-xs">Estimated</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                At-Risk Removals ({atRiskMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <TooltipProvider>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Risk Reason</TableHead>
                      <TableHead className="text-right">Conf.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atRiskMembers.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>
                          <span className="font-medium">{m.lastName}, {m.firstName}</span>
                          <span className="ml-1 text-xs text-muted-foreground">{m.age}{m.gender[0]}</span>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm cursor-help border-b border-dotted border-muted-foreground/50">
                                {m.reason}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs">
                              <p className="text-xs font-medium mb-1">Evidence</p>
                              <p className="text-xs">{m.evidence}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="text-right">{confidenceBadge(m.confidence)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TooltipProvider>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserPlus className="h-4 w-4 text-primary" />
                Expected Adds ({expectedAdds.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <TooltipProvider>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="text-right">Conf.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expectedAdds.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>
                          <span className="font-medium">{m.lastName}, {m.firstName}</span>
                          <span className="ml-1 text-xs text-muted-foreground">{m.age}{m.gender[0]}</span>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm cursor-help border-b border-dotted border-muted-foreground/50">
                                {m.reason}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs">
                              <p className="text-xs font-medium mb-1">Evidence</p>
                              <p className="text-xs">{m.evidence}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="text-right">{confidenceBadge(m.confidence)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
