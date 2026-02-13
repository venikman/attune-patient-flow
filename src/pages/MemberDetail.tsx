import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Building2, Shield, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMemberById, type ChangeType } from "@/data/mock-data";

const changeTypeColors: Record<ChangeType, string> = {
  nochange: "bg-primary/10 text-primary border-0",
  new: "bg-primary/20 text-primary border-0 font-semibold",
  dropped: "bg-destructive/10 text-destructive border-0",
  changed: "bg-chart-4/20 text-chart-4 border-0",
};

const changeTypeLabels: Record<ChangeType, string> = {
  nochange: "Active",
  new: "New",
  dropped: "Dropped",
  changed: "Changed",
};

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const member = getMemberById(id || "");

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-lg text-muted-foreground">Member not found</p>
        <Button variant="outline" asChild><Link to="/patients"><ArrowLeft className="mr-2 h-4 w-4" />Back to Panel</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/patients"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{member.lastName}, {member.firstName}</h1>
            <Badge className={changeTypeColors[member.changeType]}>{changeTypeLabels[member.changeType]}</Badge>
            {member.inactive && <Badge variant="outline" className="text-xs">Inactive</Badge>}
          </div>
          <p className="text-muted-foreground">{member.memberId} · {member.age} yrs · {member.gender}</p>
        </div>
      </div>

      {member.changeReason && (
        <Card className="border-primary/30 bg-accent/30">
          <CardContent className="flex items-center gap-3 py-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <span className="font-medium">Change reason: </span>
              <span>{member.changeReason}</span>
              {member.changeDate && <span className="text-muted-foreground"> — {member.changeDate}</span>}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Demographics */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <User className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Demographics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Name" value={`${member.firstName} ${member.lastName}`} />
            <Row label="Date of Birth" value={member.dateOfBirth} />
            <Row label="Age" value={`${member.age}`} />
            <Row label="Gender" value={member.gender} />
            <Row label="Address" value={member.address} />
            <Row label="Phone" value={member.phone} />
          </CardContent>
        </Card>

        {/* Attributed Provider (ext-attributedProvider) */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Building2 className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Attributed Provider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Name" value={member.provider.name} />
            <Row label="NPI" value={member.provider.npi} />
            <Row label="NPI System" value="http://hl7.org/fhir/sid/us-npi" />
            <Row label="TIN" value={member.provider.tin} />
            <Row label="TIN System" value="urn:oid:2.16.840.1.113883.4.4" />
            <Row label="Specialty" value={member.provider.specialty} />
          </CardContent>
        </Card>

        {/* Coverage (ext-coverageReference) */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Shield className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Coverage ID" value={member.coverage.coverageId} />
            <Row label="Plan" value={member.plan.name} />
            <Row label="Payer" value={member.plan.payer} />
            <Row label="Contract ID" value={member.plan.contractId} />
            <Row label="Subscriber ID" value={member.coverage.subscriberId} />
            <Row label="Member ID" value={member.coverage.memberId} />
            <Row label="Attribution Period" value={`${member.attributionPeriodStart} — ${member.attributionPeriodEnd}`} />
            <Row label="Contract Validity" value={`${member.plan.contractValidityPeriod.start} — ${member.plan.contractValidityPeriod.end}`} />
          </CardContent>
        </Card>
      </div>

      {/* Attribution History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Attribution History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-1 before:h-[calc(100%-8px)] before:w-px before:bg-border">
            {member.history.map((h, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-primary bg-card" />
                <p className="text-sm font-medium">{h.event}</p>
                <p className="text-xs text-muted-foreground">{h.date} — {h.details}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
