

# FHIR Inspector Component

Add an expandable "FHIR Inspector" section at the bottom of each page (Dashboard, Patient Panel, Member Detail) that shows the raw FHIR-compliant JSON representation of the data currently displayed on that page.

## What You Will See

- A collapsible section at the bottom of each page with a code bracket icon and "FHIR Inspector" label
- Collapsed by default to keep pages clean
- When expanded, shows syntax-highlighted JSON representing the FHIR resources used on that page
- Each page shows contextually relevant resources:
  - **Dashboard (Index)**: The ATR Group resource with member entries for added/dropped members, plus projected data
  - **Patient Panel**: The full ATR Group resource with all filtered members as Group.member entries
  - **Member Detail**: Individual Patient, Coverage, Practitioner, and Group.member entry resources for that specific member

## Technical Details

### New Component: `src/components/FhirInspector.tsx`
- Accepts a `data` prop (any object/array) and an optional `title` string
- Uses the existing Collapsible component from Radix UI
- Renders `JSON.stringify(data, null, 2)` inside a styled `<pre>` block with monospace font, dark background, and horizontal scroll
- Includes a copy-to-clipboard button using the Clipboard API

### New Utility: `src/lib/fhir-transforms.ts`
- `memberToFhirPatient(member)` -- converts a Member to a FHIR Patient resource skeleton
- `memberToFhirCoverage(member)` -- converts to a FHIR Coverage resource
- `providerToFhirPractitioner(provider)` -- converts to a FHIR Practitioner resource
- `membersToAtrGroup(members, attributionList)` -- converts the member list + attribution metadata into a Da Vinci ATR Group resource with proper extensions (`ext-changeType`, `ext-attributedProvider`, member periods, `ext-attributionListStatus`, `ext-contractValidityPeriod`)

### Page Updates
- **Index.tsx**: Add `<FhirInspector>` at the bottom with the ATR Group JSON built from displayed members (new + dropped) and projections
- **PatientPanel.tsx**: Add `<FhirInspector>` with the ATR Group JSON built from the current filtered member set
- **MemberDetail.tsx**: Add `<FhirInspector>` with a FHIR Bundle containing Patient, Coverage, Practitioner, and the Group.member entry for that member

