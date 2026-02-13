import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, FileText, Clock, Building2, Hash, CalendarDays } from "lucide-react";
import { attributionList, allMembers, allProviders, allPlans } from "@/data/mock-data";
import { FhirInspector } from "@/components/FhirInspector";
import { membersToAtrGroup } from "@/lib/fhir-transforms";

export default function RosterPassport() {
  const list = attributionList;
  const activeCount = allMembers.filter((m) => !m.inactive).length;

  const statusColor = list.status === "final"
    ? "bg-primary/10 text-primary"
    : "bg-chart-4/20 text-chart-4";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Roster Passport</h1>
        <p className="text-sm text-muted-foreground">
          Characterization header — context strip for comparability &amp; auditability (CHR)
        </p>
      </div>

      {/* Passport Card */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-primary" />
            {list.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Identity row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Hash className="h-3 w-3" /> NPI</p>
              <p className="font-mono text-sm font-medium">{list.npi}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Hash className="h-3 w-3" /> TIN</p>
              <p className="font-mono text-sm font-medium">{list.tin}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" /> List Status</p>
              <Badge className={`${statusColor} border-0`}>{list.status}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Last Updated</p>
              <p className="text-sm font-medium">{new Date(list.lastUpdated).toLocaleDateString()}</p>
            </div>
          </div>

          <Separator />

          {/* Period + counts */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Contract Validity</p>
              <p className="text-sm font-medium">{list.contractValidityPeriod.start} → {list.contractValidityPeriod.end}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Active Members</p>
              <p className="text-lg font-bold text-primary">{activeCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Providers</p>
              <p className="text-lg font-bold">{allProviders.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Plans</p>
              <p className="text-lg font-bold">{allPlans.length}</p>
            </div>
          </div>

          <Separator />

          {/* Attributed Providers */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Building2 className="h-3 w-3" /> Attributed Providers
            </p>
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="py-1.5 h-auto">Name</TableHead>
                  <TableHead className="py-1.5 h-auto">NPI</TableHead>
                  <TableHead className="py-1.5 h-auto">TIN</TableHead>
                  <TableHead className="py-1.5 h-auto">Specialty</TableHead>
                  <TableHead className="py-1.5 h-auto text-right">Members</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allProviders.map((p) => {
                  const count = allMembers.filter((m) => !m.inactive && m.provider.npi === p.npi).length;
                  return (
                    <TableRow key={p.npi} className="text-sm">
                      <TableCell className="py-1.5 font-medium">{p.name}</TableCell>
                      <TableCell className="py-1.5 font-mono text-xs">{p.npi}</TableCell>
                      <TableCell className="py-1.5 font-mono text-xs">{p.tin}</TableCell>
                      <TableCell className="py-1.5">{p.specialty}</TableCell>
                      <TableCell className="py-1.5 text-right font-semibold">{count}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Coverage / Plans */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Coverage References (Plans)</p>
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="py-1.5 h-auto">Plan</TableHead>
                  <TableHead className="py-1.5 h-auto">Payer</TableHead>
                  <TableHead className="py-1.5 h-auto">Contract ID</TableHead>
                  <TableHead className="py-1.5 h-auto">Validity</TableHead>
                  <TableHead className="py-1.5 h-auto text-right">Members</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPlans.map((pl) => {
                  const count = allMembers.filter((m) => !m.inactive && m.plan.contractId === pl.contractId).length;
                  return (
                    <TableRow key={pl.contractId} className="text-sm">
                      <TableCell className="py-1.5 font-medium">{pl.name}</TableCell>
                      <TableCell className="py-1.5">{pl.payer}</TableCell>
                      <TableCell className="py-1.5 font-mono text-xs">{pl.contractId}</TableCell>
                      <TableCell className="py-1.5 text-xs">{pl.contractValidityPeriod.start} → {pl.contractValidityPeriod.end}</TableCell>
                      <TableCell className="py-1.5 text-right font-semibold">{count}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* FPF Note */}
      <div className="rounded-lg border border-dashed border-primary/30 bg-accent/30 p-3 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">FPF — CHR:</span> This passport establishes characterization so all downstream charts use the same meaning, window, and constraints. Comparability is explicit.
      </div>

      <FhirInspector
        data={membersToAtrGroup(allMembers.filter(m => !m.inactive), attributionList)}
        title="FHIR Inspector — ATR Group (Passport Context)"
      />
    </div>
  );
}
