import type { Member, Provider, AttributionList } from "@/data/mock-data";

const ATR_BASE = "http://hl7.org/fhir/us/davinci-atr/StructureDefinition";

export function memberToFhirPatient(member: Member) {
  return {
    resourceType: "Patient",
    id: member.id,
    identifier: [
      {
        type: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0203", code: "MB" }] },
        system: "urn:oid:2.16.840.1.113883.4.642",
        value: member.memberId,
      },
    ],
    name: [{ family: member.lastName, given: [member.firstName] }],
    gender: member.gender === "Male" ? "male" : "female",
    birthDate: member.dateOfBirth,
    telecom: [{ system: "phone", value: member.phone, use: "home" }],
    address: [{ text: member.address, use: "home" }],
  };
}

export function memberToFhirCoverage(member: Member) {
  return {
    resourceType: "Coverage",
    id: member.coverage.coverageId,
    status: member.inactive ? "cancelled" : "active",
    subscriberId: member.coverage.subscriberId,
    beneficiary: { reference: `Patient/${member.id}` },
    payor: [{ display: member.plan.payer }],
    class: [
      {
        type: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/coverage-class", code: "plan" }] },
        value: member.plan.contractId,
        name: member.plan.name,
      },
    ],
    period: {
      start: member.attributionPeriodStart,
      end: member.attributionPeriodEnd,
    },
  };
}

export function providerToFhirPractitioner(provider: Provider) {
  return {
    resourceType: "Practitioner",
    id: `pract-${provider.npi}`,
    identifier: [
      { system: "http://hl7.org/fhir/sid/us-npi", value: provider.npi },
      { system: "urn:oid:2.16.840.1.113883.4.4", value: provider.tin },
    ],
    name: [{ text: provider.name }],
    qualification: provider.specialty
      ? [{ code: { text: provider.specialty } }]
      : undefined,
  };
}

function memberToGroupEntry(member: Member) {
  return {
    extension: [
      {
        url: `${ATR_BASE}/ext-changeType`,
        valueCode: member.changeType,
      },
      {
        url: `${ATR_BASE}/ext-attributedProvider`,
        valueReference: {
          reference: `Practitioner/pract-${member.provider.npi}`,
          display: member.provider.name,
        },
      },
      {
        url: `${ATR_BASE}/ext-coverageReference`,
        valueReference: {
          reference: `Coverage/${member.coverage.coverageId}`,
        },
      },
    ],
    entity: { reference: `Patient/${member.id}`, display: `${member.lastName}, ${member.firstName}` },
    period: { start: member.attributionPeriodStart, end: member.attributionPeriodEnd },
    inactive: member.inactive,
  };
}

export function membersToAtrGroup(members: Member[], attrList: AttributionList) {
  return {
    resourceType: "Group",
    id: "atr-group-1",
    meta: { lastUpdated: attrList.lastUpdated, profile: [`${ATR_BASE}/atr-group`] },
    extension: [
      {
        url: `${ATR_BASE}/ext-attributionListStatus`,
        valueCode: attrList.status,
      },
      {
        url: `${ATR_BASE}/ext-contractValidityPeriod`,
        valuePeriod: attrList.contractValidityPeriod,
      },
    ],
    identifier: [
      { system: "http://hl7.org/fhir/sid/us-npi", value: attrList.npi },
      { system: "urn:oid:2.16.840.1.113883.4.4", value: attrList.tin },
    ],
    type: "person",
    actual: true,
    name: attrList.name,
    quantity: members.filter((m) => !m.inactive).length,
    member: members.map(memberToGroupEntry),
  };
}

export function memberToFhirBundle(member: Member) {
  return {
    resourceType: "Bundle",
    type: "collection",
    entry: [
      { resource: memberToFhirPatient(member) },
      { resource: memberToFhirCoverage(member) },
      { resource: providerToFhirPractitioner(member.provider) },
      { resource: memberToGroupEntry(member), search: { mode: "include" } },
    ],
  };
}
