import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allMembers, allProviders, allPlans, type AttributionStatus } from "@/data/mock-data";

const statusConfig: Record<AttributionStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-primary/10 text-primary border-0" },
  new: { label: "New", className: "bg-primary/20 text-primary border-0 font-semibold" },
  removed: { label: "Removed", className: "bg-destructive/10 text-destructive border-0" },
  pending: { label: "Pending", className: "bg-muted/50 text-muted-foreground border-0" },
};

export default function PatientPanel() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return allMembers.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (planFilter !== "all" && m.plan.contractId !== planFilter) return false;
      if (providerFilter !== "all" && m.provider.npi !== providerFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          m.firstName.toLowerCase().includes(q) ||
          m.lastName.toLowerCase().includes(q) ||
          m.memberId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, statusFilter, planFilter, providerFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patient Panel</h1>
        <p className="text-muted-foreground">All attributed members — {filtered.length} of {allMembers.length} shown</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or member ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="new">New This Month</SelectItem>
            <SelectItem value="removed">Removed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Plan" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            {allPlans.map((p) => (
              <SelectItem key={p.contractId} value={p.contractId}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Provider" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            {allProviders.map((p) => (
              <SelectItem key={p.npi} value={p.npi}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Member ID</TableHead>
              <TableHead className="hidden md:table-cell">Provider</TableHead>
              <TableHead className="hidden lg:table-cell">Plan</TableHead>
              <TableHead className="hidden lg:table-cell">Period</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.id} className="cursor-pointer" onClick={() => window.location.href = `/patients/${m.id}`}>
                <TableCell>
                  <div>
                    <Link to={`/patients/${m.id}`} className="font-medium hover:underline">{m.lastName}, {m.firstName}</Link>
                    <span className="ml-2 text-sm text-muted-foreground">{m.age}{m.gender[0]}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{m.memberId}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">{m.provider.name}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm">{m.plan.name}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm">
                  {m.attributionPeriodStart} — {m.attributionPeriodEnd}
                </TableCell>
                <TableCell>
                  <Badge className={statusConfig[m.status].className}>
                    {statusConfig[m.status].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
