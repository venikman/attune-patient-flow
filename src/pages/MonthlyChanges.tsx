import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, UserMinus, ArrowLeftRight } from "lucide-react";
import { allMembers, summaryStats } from "@/data/mock-data";

const newMembers = allMembers.filter((m) => m.changeType === "new");
const removedMembers = allMembers.filter((m) => m.changeType === "dropped");

export default function MonthlyChanges() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Monthly Changes</h1>
        <p className="text-muted-foreground">January 2025 → February 2025 Attribution Comparison</p>
      </div>

      {/* Churn Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="rounded-lg bg-primary/10 p-2"><UserPlus className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold text-primary">{summaryStats.newThisMonth}</p>
              <p className="text-sm text-muted-foreground">Members Added</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="rounded-lg bg-destructive/10 p-2"><UserMinus className="h-5 w-5 text-destructive" /></div>
            <div>
              <p className="text-2xl font-bold text-destructive">{summaryStats.removedThisMonth}</p>
              <p className="text-sm text-muted-foreground">Members Removed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="rounded-lg bg-accent p-2"><ArrowLeftRight className="h-5 w-5 text-accent-foreground" /></div>
            <div>
              <p className="text-2xl font-bold">{summaryStats.netChange > 0 ? "+" : ""}{summaryStats.netChange}</p>
              <p className="text-sm text-muted-foreground">Net Change</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Added Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Added Members
          </CardTitle>
          <CardDescription>{newMembers.length} members attributed this month</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead className="hidden md:table-cell">Provider</TableHead>
                <TableHead className="hidden md:table-cell">Plan</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newMembers.map((m) => (
                <TableRow key={m.id} className="cursor-pointer" onClick={() => window.location.href = `/patients/${m.id}`}>
                  <TableCell>
                    <Link to={`/patients/${m.id}`} className="font-medium hover:underline">{m.lastName}, {m.firstName}</Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{m.memberId}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{m.provider.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{m.plan.name}</TableCell>
                  <TableCell>
                    <Badge className="bg-primary/10 text-primary border-0">{m.changeReason}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Removed Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserMinus className="h-5 w-5 text-destructive" />
            Removed Members
          </CardTitle>
          <CardDescription>{removedMembers.length} members removed from attribution this month</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead className="hidden md:table-cell">Provider</TableHead>
                <TableHead className="hidden md:table-cell">Plan</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {removedMembers.map((m) => (
                <TableRow key={m.id} className="cursor-pointer" onClick={() => window.location.href = `/patients/${m.id}`}>
                  <TableCell>
                    <Link to={`/patients/${m.id}`} className="font-medium hover:underline">{m.lastName}, {m.firstName}</Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{m.memberId}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{m.provider.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{m.plan.name}</TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="border-0">{m.changeReason}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
