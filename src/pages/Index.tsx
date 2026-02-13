import { Users, TrendingUp, TrendingDown, UserPlus, UserMinus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allMembers, summaryStats } from "@/data/mock-data";
import { Link } from "react-router-dom";

const newMembers = allMembers.filter((m) => m.status === "new");
const removedMembers = allMembers.filter((m) => m.status === "removed");

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

      {/* Two tables side by side */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Added */}
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

        {/* Removed */}
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
    </div>
  );
}
