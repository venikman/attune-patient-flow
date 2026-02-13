import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allMembers, allProviders, allPlans, attributionList, type ChangeType } from "@/data/mock-data";
import { FhirInspector } from "@/components/FhirInspector";
import { membersToAtrGroup } from "@/lib/fhir-transforms";

const changeTypeConfig: Record<ChangeType, { label: string; className: string }> = {
  nochange: { label: "Active", className: "bg-primary/10 text-primary border-0" },
  new: { label: "New", className: "bg-primary/20 text-primary border-0 font-semibold" },
  dropped: { label: "Dropped", className: "bg-destructive/10 text-destructive border-0" },
  changed: { label: "Changed", className: "bg-chart-4/20 text-chart-4 border-0" },
};

export default function PatientPanel() {
  const [search, setSearch] = useState("");
  const [changeTypeFilter, setChangeTypeFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return allMembers.filter((m) => {
      if (changeTypeFilter !== "all" && m.changeType !== changeTypeFilter) return false;
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
  }, [search, changeTypeFilter, planFilter, providerFilter]);

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
        <Select value={changeTypeFilter} onValueChange={setChangeTypeFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Change Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="nochange">Active (nochange)</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="dropped">Dropped</SelectItem>
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
              <TableHead>Change Type</TableHead>
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
                  <Badge className={changeTypeConfig[m.changeType].className}>
                    {changeTypeConfig[m.changeType].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <FhirInspector
        data={membersToAtrGroup(filtered, attributionList)}
        title="FHIR Inspector — ATR Group (Filtered Panel)"
      />
    </div>
  );
}
