import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, FileText, Shield, Stethoscope, Clock } from "lucide-react";
import { allMembers } from "@/data/mock-data";
import { memberToFhirBundle, memberToFhirPatient, memberToFhirCoverage, providerToFhirPractitioner } from "@/lib/fhir-transforms";
import { FhirInspector } from "@/components/FhirInspector";

export default function BundleCard() {
  const [selectedId, setSelectedId] = useState(allMembers[0].id);
  const member = allMembers.find((m) => m.id === selectedId) || allMembers[0];

  const patient = memberToFhirPatient(member);
  const coverage = memberToFhirCoverage(member);
  const practitioner = providerToFhirPractitioner(member.provider);
  const bundle = memberToFhirBundle(member);

  const statusColor = member.inactive
    ? "bg-destructive/10 text-destructive"
    : "bg-primary/10 text-primary";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Per-Patient Attribution Bundle Card</h1>
          <p className="text-sm text-muted-foreground">
            Standard drill-down — "why is this patient here?" without ad-hoc joins
          </p>
        </div>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allMembers.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.lastName}, {m.firstName} ({m.memberId})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Patient */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Patient
              <Badge className={`${statusColor} border-0 text-[10px] ml-auto`}>
                {member.inactive ? "Inactive" : "Active"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground w-28">Name</TableCell><TableCell className="py-1 font-medium">{patient.name[0].given[0]} {patient.name[0].family}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">DOB</TableCell><TableCell className="py-1">{patient.birthDate}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">Gender</TableCell><TableCell className="py-1 capitalize">{patient.gender}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">Member ID</TableCell><TableCell className="py-1 font-mono text-xs">{patient.identifier[0].value}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">Phone</TableCell><TableCell className="py-1">{patient.telecom[0].value}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">Address</TableCell><TableCell className="py-1 text-xs">{patient.address[0].text}</TableCell></TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Coverage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Coverage
              <Badge className={`${coverage.status === "active" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"} border-0 text-[10px] ml-auto`}>
                {coverage.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground w-28">Coverage ID</TableCell><TableCell className="py-1 font-mono text-xs">{coverage.id}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">Subscriber</TableCell><TableCell className="py-1 font-mono text-xs">{coverage.subscriberId}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">Plan</TableCell><TableCell className="py-1">{coverage.class[0].name}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">Payer</TableCell><TableCell className="py-1">{coverage.payor[0].display}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">Period</TableCell><TableCell className="py-1 text-xs font-mono">{coverage.period.start} → {coverage.period.end}</TableCell></TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Practitioner */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              Attributed Provider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground w-28">Name</TableCell><TableCell className="py-1 font-medium">{practitioner.name[0].text}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">NPI</TableCell><TableCell className="py-1 font-mono text-xs">{practitioner.identifier[0].value}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">TIN</TableCell><TableCell className="py-1 font-mono text-xs">{practitioner.identifier[1].value}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">Specialty</TableCell><TableCell className="py-1">{practitioner.qualification?.[0]?.code?.text || "—"}</TableCell></TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Attribution Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Attribution Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground w-28">Change Type</TableCell><TableCell className="py-1"><Badge variant="outline" className="text-[10px]">{member.changeType}</Badge></TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">Reason</TableCell><TableCell className="py-1">{member.changeReason || "—"}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">Change Date</TableCell><TableCell className="py-1 font-mono text-xs">{member.changeDate || "—"}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">Period</TableCell><TableCell className="py-1 text-xs font-mono">{member.attributionPeriodStart} → {member.attributionPeriodEnd}</TableCell></TableRow>
                <TableRow className="text-sm"><TableCell className="py-1 text-muted-foreground">Inactive</TableCell><TableCell className="py-1">{member.inactive ? "Yes" : "No"}</TableCell></TableRow>
              </TableBody>
            </Table>

            {member.history.length > 0 && (
              <>
                <Separator className="my-2" />
                <p className="text-xs font-medium text-muted-foreground mb-1">Provenance Timeline</p>
                <div className="space-y-1">
                  {member.history.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-muted-foreground w-20 shrink-0">{h.date}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{h.event}</Badge>
                      <span className="text-muted-foreground">{h.details}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* FPF Note */}
      <div className="rounded-lg border border-dashed border-primary/30 bg-accent/30 p-3 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">FPF — Evidence Pack:</span> One place to answer "why is this patient here?" without ad-hoc joins. Standard FHIR Bundle keeps drill-down interoperable.
      </div>

      <FhirInspector data={bundle} title={`FHIR Inspector — Attribution Bundle for ${member.firstName} ${member.lastName}`} />
    </div>
  );
}
