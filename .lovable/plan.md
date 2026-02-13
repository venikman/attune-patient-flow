
# Da Vinci ATR Provider Attribution Dashboard

## Overview
A provider-facing dashboard that visualizes a Member Attribution List with realistic FHIR-aligned mock data. The app shows the current attributed patient panel, key summary metrics, and highlights month-over-month changes (new members, removed members, and reasons for changes).

## Pages & Features

### 1. Attribution Dashboard (Home)
- **Summary cards** at the top showing:
  - Total attributed members (current month)
  - Net change from previous month (+/- count)
  - New members added this month
  - Members removed this month
- **Attribution trend mini-chart** showing member count over last 6 months
- **Change highlights section** showing the most recent additions and removals with reasons (e.g., "New enrollment," "PCP selection," "Moved out of area," "Coverage terminated," "Reassigned to different provider")

### 2. Patient Panel (Member List)
A searchable, filterable table of all attributed members with columns:
- **Patient name & demographics** (age, gender)
- **Member ID / Subscriber ID**
- **Attributed Provider** (name, NPI)
- **Plan / Contract** (plan name, payer, contract ID)
- **Attribution Period** (start/end dates)
- **Attribution Status** (active, pending, removed)
- **Change indicator** — badge showing "New," "Returning," or nothing for unchanged members

Filters for:
- Attribution status (active, new this month, removed)
- Plan/payer
- Attributed provider
- Search by patient name or member ID

### 3. Member Detail View
Clicking a patient row opens a detail panel/page showing:
- Full patient demographics
- Coverage information (plan, subscriber info, enrollment dates)
- Attributed provider details (name, NPI, TIN, specialty)
- Attribution history timeline (when attributed, any changes, prior attributions)
- Change reason if newly added or removed

### 4. Monthly Changes View
A dedicated view comparing current vs. previous month:
- **Added members** table with reason for addition (new enrollment, PCP change, manual add, algorithm-based)
- **Removed members** table with reason for removal (disenrollment, moved, reassigned, coverage ended)
- **Summary statistics** of churn

## Mock Data
All data will be realistic, FHIR-aligned mock data representing ~50 attributed patients across 2-3 plans/contracts, with ~8 new and ~5 removed members to demonstrate the diff functionality. Patient names, NPIs, member IDs, and dates will be realistic but fictional.

## Design
- Clean, professional healthcare dashboard aesthetic
- Light color scheme with subtle blue/teal accent colors
- Status badges with intuitive color coding (green for new, red for removed, blue for active)
- Responsive layout suitable for desktop use
