import { format, subMonths, subDays, addDays } from "date-fns";

export type AttributionStatus = "active" | "new" | "removed" | "pending";
export type ChangeReason =
  | "New enrollment"
  | "PCP selection"
  | "Algorithm-based attribution"
  | "Manual add"
  | "Returning member"
  | "Coverage terminated"
  | "Moved out of area"
  | "Reassigned to different provider"
  | "Disenrollment"
  | "Deceased";

export interface Provider {
  name: string;
  npi: string;
  tin: string;
  specialty: string;
}

export interface Plan {
  name: string;
  payer: string;
  contractId: string;
}

export interface AttributionHistory {
  date: string;
  event: string;
  details: string;
}

export interface Member {
  id: string;
  memberId: string;
  subscriberId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: "Male" | "Female";
  address: string;
  phone: string;
  provider: Provider;
  plan: Plan;
  attributionPeriodStart: string;
  attributionPeriodEnd: string;
  status: AttributionStatus;
  changeReason?: ChangeReason;
  changeDate?: string;
  history: AttributionHistory[];
}

const providers: Provider[] = [
  { name: "Dr. Sarah Chen", npi: "1234567890", tin: "12-3456789", specialty: "Internal Medicine" },
  { name: "Dr. James Wilson", npi: "2345678901", tin: "12-3456789", specialty: "Family Medicine" },
  { name: "Dr. Maria Garcia", npi: "3456789012", tin: "23-4567890", specialty: "Internal Medicine" },
];

const plans: Plan[] = [
  { name: "Blue Shield Gold PPO", payer: "Blue Shield of California", contractId: "BSC-2025-G001" },
  { name: "Aetna Choice POS II", payer: "Aetna", contractId: "AET-2025-P042" },
  { name: "UHC Navigate HMO", payer: "UnitedHealthcare", contractId: "UHC-2025-H017" },
];

const now = new Date(2025, 1, 1); // Feb 2025 as reference
const currentMonth = format(now, "yyyy-MM-dd");
const prevMonth = format(subMonths(now, 1), "yyyy-MM-dd");

function makeHistory(status: AttributionStatus, changeReason?: ChangeReason): AttributionHistory[] {
  if (status === "new") {
    return [
      { date: format(now, "yyyy-MM-dd"), event: "Attributed", details: changeReason || "New enrollment" },
    ];
  }
  if (status === "removed") {
    return [
      { date: format(subMonths(now, 8), "yyyy-MM-dd"), event: "Attributed", details: "Initial attribution" },
      { date: format(now, "yyyy-MM-dd"), event: "Removed", details: changeReason || "Coverage terminated" },
    ];
  }
  return [
    { date: format(subMonths(now, Math.floor(Math.random() * 12) + 3), "yyyy-MM-dd"), event: "Attributed", details: "Initial attribution" },
  ];
}

const activeMembers: Omit<Member, "history">[] = [
  { id: "m-001", memberId: "MBR-10234", subscriberId: "SUB-50001", firstName: "Robert", lastName: "Anderson", dateOfBirth: "1958-03-15", age: 66, gender: "Male", address: "123 Oak St, Sacramento, CA 95814", phone: "(916) 555-0101", provider: providers[0], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-002", memberId: "MBR-10235", subscriberId: "SUB-50002", firstName: "Patricia", lastName: "Williams", dateOfBirth: "1962-07-22", age: 62, gender: "Female", address: "456 Elm Ave, Sacramento, CA 95816", phone: "(916) 555-0102", provider: providers[0], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-003", memberId: "MBR-10236", subscriberId: "SUB-50003", firstName: "James", lastName: "Brown", dateOfBirth: "1970-11-03", age: 54, gender: "Male", address: "789 Pine Dr, Folsom, CA 95630", phone: "(916) 555-0103", provider: providers[0], plan: plans[1], attributionPeriodStart: "2024-10-01", attributionPeriodEnd: "2025-09-30", status: "active" },
  { id: "m-004", memberId: "MBR-10237", subscriberId: "SUB-50004", firstName: "Linda", lastName: "Davis", dateOfBirth: "1955-01-19", age: 70, gender: "Female", address: "321 Maple Ln, Roseville, CA 95661", phone: "(916) 555-0104", provider: providers[0], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-005", memberId: "MBR-10238", subscriberId: "SUB-50005", firstName: "Michael", lastName: "Johnson", dateOfBirth: "1978-09-08", age: 46, gender: "Male", address: "654 Cedar Blvd, Elk Grove, CA 95624", phone: "(916) 555-0105", provider: providers[1], plan: plans[1], attributionPeriodStart: "2024-10-01", attributionPeriodEnd: "2025-09-30", status: "active" },
  { id: "m-006", memberId: "MBR-10239", subscriberId: "SUB-50006", firstName: "Barbara", lastName: "Miller", dateOfBirth: "1968-04-12", age: 56, gender: "Female", address: "987 Birch Way, Davis, CA 95616", phone: "(530) 555-0106", provider: providers[1], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-007", memberId: "MBR-10240", subscriberId: "SUB-50007", firstName: "William", lastName: "Wilson", dateOfBirth: "1952-12-25", age: 72, gender: "Male", address: "147 Walnut Ct, Sacramento, CA 95819", phone: "(916) 555-0107", provider: providers[1], plan: plans[2], attributionPeriodStart: "2025-01-01", attributionPeriodEnd: "2025-12-31", status: "active" },
  { id: "m-008", memberId: "MBR-10241", subscriberId: "SUB-50008", firstName: "Elizabeth", lastName: "Moore", dateOfBirth: "1975-06-30", age: 49, gender: "Female", address: "258 Spruce Dr, Rancho Cordova, CA 95670", phone: "(916) 555-0108", provider: providers[2], plan: plans[2], attributionPeriodStart: "2025-01-01", attributionPeriodEnd: "2025-12-31", status: "active" },
  { id: "m-009", memberId: "MBR-10242", subscriberId: "SUB-50009", firstName: "David", lastName: "Taylor", dateOfBirth: "1980-02-14", age: 44, gender: "Male", address: "369 Ash St, Citrus Heights, CA 95610", phone: "(916) 555-0109", provider: providers[2], plan: plans[1], attributionPeriodStart: "2024-10-01", attributionPeriodEnd: "2025-09-30", status: "active" },
  { id: "m-010", memberId: "MBR-10243", subscriberId: "SUB-50010", firstName: "Jennifer", lastName: "Thomas", dateOfBirth: "1965-08-07", age: 59, gender: "Female", address: "480 Redwood Ave, Woodland, CA 95695", phone: "(530) 555-0110", provider: providers[0], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-011", memberId: "MBR-10244", subscriberId: "SUB-50011", firstName: "Richard", lastName: "Jackson", dateOfBirth: "1973-10-20", age: 51, gender: "Male", address: "591 Sequoia Pl, Sacramento, CA 95825", phone: "(916) 555-0111", provider: providers[0], plan: plans[1], attributionPeriodStart: "2024-10-01", attributionPeriodEnd: "2025-09-30", status: "active" },
  { id: "m-012", memberId: "MBR-10245", subscriberId: "SUB-50012", firstName: "Susan", lastName: "White", dateOfBirth: "1960-05-18", age: 64, gender: "Female", address: "702 Magnolia Dr, Fair Oaks, CA 95628", phone: "(916) 555-0112", provider: providers[1], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-013", memberId: "MBR-10246", subscriberId: "SUB-50013", firstName: "Joseph", lastName: "Harris", dateOfBirth: "1982-01-09", age: 43, gender: "Male", address: "813 Poplar Ln, Carmichael, CA 95608", phone: "(916) 555-0113", provider: providers[1], plan: plans[2], attributionPeriodStart: "2025-01-01", attributionPeriodEnd: "2025-12-31", status: "active" },
  { id: "m-014", memberId: "MBR-10247", subscriberId: "SUB-50014", firstName: "Margaret", lastName: "Martin", dateOfBirth: "1957-11-27", age: 67, gender: "Female", address: "924 Cypress Rd, Orangevale, CA 95662", phone: "(916) 555-0114", provider: providers[2], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-015", memberId: "MBR-10248", subscriberId: "SUB-50015", firstName: "Charles", lastName: "Thompson", dateOfBirth: "1971-03-03", age: 53, gender: "Male", address: "135 Willow St, Sacramento, CA 95831", phone: "(916) 555-0115", provider: providers[2], plan: plans[1], attributionPeriodStart: "2024-10-01", attributionPeriodEnd: "2025-09-30", status: "active" },
  { id: "m-016", memberId: "MBR-10249", subscriberId: "SUB-50016", firstName: "Dorothy", lastName: "Garcia", dateOfBirth: "1963-09-14", age: 61, gender: "Female", address: "246 Juniper Ave, West Sacramento, CA 95691", phone: "(916) 555-0116", provider: providers[0], plan: plans[2], attributionPeriodStart: "2025-01-01", attributionPeriodEnd: "2025-12-31", status: "active" },
  { id: "m-017", memberId: "MBR-10250", subscriberId: "SUB-50017", firstName: "Thomas", lastName: "Martinez", dateOfBirth: "1985-07-21", age: 39, gender: "Male", address: "357 Sycamore Ct, Rocklin, CA 95677", phone: "(916) 555-0117", provider: providers[0], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-018", memberId: "MBR-10251", subscriberId: "SUB-50018", firstName: "Nancy", lastName: "Robinson", dateOfBirth: "1969-12-05", age: 55, gender: "Female", address: "468 Chestnut Blvd, Lincoln, CA 95648", phone: "(916) 555-0118", provider: providers[1], plan: plans[1], attributionPeriodStart: "2024-10-01", attributionPeriodEnd: "2025-09-30", status: "active" },
  { id: "m-019", memberId: "MBR-10252", subscriberId: "SUB-50019", firstName: "Daniel", lastName: "Clark", dateOfBirth: "1977-04-16", age: 47, gender: "Male", address: "579 Hawthorn Way, Loomis, CA 95650", phone: "(916) 555-0119", provider: providers[1], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-020", memberId: "MBR-10253", subscriberId: "SUB-50020", firstName: "Karen", lastName: "Rodriguez", dateOfBirth: "1966-08-29", age: 58, gender: "Female", address: "680 Dogwood Dr, Placerville, CA 95667", phone: "(530) 555-0120", provider: providers[2], plan: plans[2], attributionPeriodStart: "2025-01-01", attributionPeriodEnd: "2025-12-31", status: "active" },
  { id: "m-021", memberId: "MBR-10254", subscriberId: "SUB-50021", firstName: "Mark", lastName: "Lewis", dateOfBirth: "1974-02-10", age: 50, gender: "Male", address: "791 Alder Ln, Sacramento, CA 95833", phone: "(916) 555-0121", provider: providers[0], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-022", memberId: "MBR-10255", subscriberId: "SUB-50022", firstName: "Betty", lastName: "Lee", dateOfBirth: "1959-06-23", age: 65, gender: "Female", address: "802 Hickory Rd, Natomas, CA 95834", phone: "(916) 555-0122", provider: providers[0], plan: plans[1], attributionPeriodStart: "2024-10-01", attributionPeriodEnd: "2025-09-30", status: "active" },
  { id: "m-023", memberId: "MBR-10256", subscriberId: "SUB-50023", firstName: "Steven", lastName: "Walker", dateOfBirth: "1981-11-11", age: 43, gender: "Male", address: "913 Aspen St, Folsom, CA 95630", phone: "(916) 555-0123", provider: providers[1], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-024", memberId: "MBR-10257", subscriberId: "SUB-50024", firstName: "Sandra", lastName: "Hall", dateOfBirth: "1953-03-07", age: 71, gender: "Female", address: "124 Beech Ave, Roseville, CA 95678", phone: "(916) 555-0124", provider: providers[2], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-025", memberId: "MBR-10258", subscriberId: "SUB-50025", firstName: "Paul", lastName: "Allen", dateOfBirth: "1976-08-19", age: 48, gender: "Male", address: "235 Palm Dr, Elk Grove, CA 95758", phone: "(916) 555-0125", provider: providers[2], plan: plans[2], attributionPeriodStart: "2025-01-01", attributionPeriodEnd: "2025-12-31", status: "active" },
  { id: "m-026", memberId: "MBR-10259", subscriberId: "SUB-50026", firstName: "Donna", lastName: "Young", dateOfBirth: "1964-01-30", age: 61, gender: "Female", address: "346 Olive St, Davis, CA 95616", phone: "(530) 555-0126", provider: providers[0], plan: plans[1], attributionPeriodStart: "2024-10-01", attributionPeriodEnd: "2025-09-30", status: "active" },
  { id: "m-027", memberId: "MBR-10260", subscriberId: "SUB-50027", firstName: "George", lastName: "King", dateOfBirth: "1972-05-25", age: 52, gender: "Male", address: "457 Ivy Ct, Woodland, CA 95695", phone: "(530) 555-0127", provider: providers[0], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-028", memberId: "MBR-10261", subscriberId: "SUB-50028", firstName: "Carol", lastName: "Wright", dateOfBirth: "1967-10-12", age: 57, gender: "Female", address: "568 Laurel Blvd, Sacramento, CA 95822", phone: "(916) 555-0128", provider: providers[1], plan: plans[2], attributionPeriodStart: "2025-01-01", attributionPeriodEnd: "2025-12-31", status: "active" },
  { id: "m-029", memberId: "MBR-10262", subscriberId: "SUB-50029", firstName: "Edward", lastName: "Lopez", dateOfBirth: "1983-07-04", age: 41, gender: "Male", address: "679 Catalpa Way, Rancho Cordova, CA 95670", phone: "(916) 555-0129", provider: providers[1], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-030", memberId: "MBR-10263", subscriberId: "SUB-50030", firstName: "Ruth", lastName: "Hill", dateOfBirth: "1956-09-18", age: 68, gender: "Female", address: "780 Cottonwood Dr, Fair Oaks, CA 95628", phone: "(916) 555-0130", provider: providers[2], plan: plans[1], attributionPeriodStart: "2024-10-01", attributionPeriodEnd: "2025-09-30", status: "active" },
  { id: "m-031", memberId: "MBR-10264", subscriberId: "SUB-50031", firstName: "Kenneth", lastName: "Scott", dateOfBirth: "1979-12-01", age: 45, gender: "Male", address: "891 Cherry Ln, Citrus Heights, CA 95621", phone: "(916) 555-0131", provider: providers[0], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-032", memberId: "MBR-10265", subscriberId: "SUB-50032", firstName: "Helen", lastName: "Green", dateOfBirth: "1961-04-15", age: 63, gender: "Female", address: "102 Mulberry Ave, Carmichael, CA 95608", phone: "(916) 555-0132", provider: providers[2], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-033", memberId: "MBR-10266", subscriberId: "SUB-50033", firstName: "Brian", lastName: "Adams", dateOfBirth: "1986-06-08", age: 38, gender: "Male", address: "213 Pecan Rd, West Sacramento, CA 95691", phone: "(916) 555-0133", provider: providers[1], plan: plans[1], attributionPeriodStart: "2024-10-01", attributionPeriodEnd: "2025-09-30", status: "active" },
  { id: "m-034", memberId: "MBR-10267", subscriberId: "SUB-50034", firstName: "Sharon", lastName: "Baker", dateOfBirth: "1954-02-28", age: 70, gender: "Female", address: "324 Locust St, Orangevale, CA 95662", phone: "(916) 555-0134", provider: providers[0], plan: plans[2], attributionPeriodStart: "2025-01-01", attributionPeriodEnd: "2025-12-31", status: "active" },
  { id: "m-035", memberId: "MBR-10268", subscriberId: "SUB-50035", firstName: "Ronald", lastName: "Nelson", dateOfBirth: "1970-08-17", age: 54, gender: "Male", address: "435 Fir Way, Lincoln, CA 95648", phone: "(916) 555-0135", provider: providers[2], plan: plans[1], attributionPeriodStart: "2024-10-01", attributionPeriodEnd: "2025-09-30", status: "active" },
  { id: "m-036", memberId: "MBR-10269", subscriberId: "SUB-50036", firstName: "Laura", lastName: "Carter", dateOfBirth: "1975-03-22", age: 49, gender: "Female", address: "546 Hemlock Ct, Rocklin, CA 95765", phone: "(916) 555-0136", provider: providers[1], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
  { id: "m-037", memberId: "MBR-10270", subscriberId: "SUB-50037", firstName: "Anthony", lastName: "Mitchell", dateOfBirth: "1984-11-06", age: 40, gender: "Male", address: "657 Linden Blvd, Sacramento, CA 95828", phone: "(916) 555-0137", provider: providers[0], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-06-30", status: "active" },
];

const newMembers: Omit<Member, "history">[] = [
  { id: "m-038", memberId: "MBR-10271", subscriberId: "SUB-50038", firstName: "Jessica", lastName: "Perez", dateOfBirth: "1988-05-14", age: 36, gender: "Female", address: "768 Basswood Dr, Sacramento, CA 95820", phone: "(916) 555-0138", provider: providers[0], plan: plans[0], attributionPeriodStart: "2025-02-01", attributionPeriodEnd: "2025-06-30", status: "new", changeReason: "New enrollment", changeDate: "2025-02-01" },
  { id: "m-039", memberId: "MBR-10272", subscriberId: "SUB-50039", firstName: "Kevin", lastName: "Roberts", dateOfBirth: "1973-09-28", age: 51, gender: "Male", address: "879 Teak Ln, Folsom, CA 95630", phone: "(916) 555-0139", provider: providers[0], plan: plans[1], attributionPeriodStart: "2025-02-01", attributionPeriodEnd: "2025-09-30", status: "new", changeReason: "PCP selection", changeDate: "2025-02-01" },
  { id: "m-040", memberId: "MBR-10273", subscriberId: "SUB-50040", firstName: "Amy", lastName: "Turner", dateOfBirth: "1980-01-17", age: 45, gender: "Female", address: "990 Mahogany Ct, Roseville, CA 95747", phone: "(916) 555-0140", provider: providers[1], plan: plans[2], attributionPeriodStart: "2025-02-01", attributionPeriodEnd: "2025-12-31", status: "new", changeReason: "Algorithm-based attribution", changeDate: "2025-02-01" },
  { id: "m-041", memberId: "MBR-10274", subscriberId: "SUB-50041", firstName: "Jason", lastName: "Phillips", dateOfBirth: "1969-04-03", age: 55, gender: "Male", address: "101 Redcedar Ave, Davis, CA 95616", phone: "(530) 555-0141", provider: providers[1], plan: plans[0], attributionPeriodStart: "2025-02-01", attributionPeriodEnd: "2025-06-30", status: "new", changeReason: "New enrollment", changeDate: "2025-02-01" },
  { id: "m-042", memberId: "MBR-10275", subscriberId: "SUB-50042", firstName: "Melissa", lastName: "Campbell", dateOfBirth: "1991-07-09", age: 33, gender: "Female", address: "212 Sweetgum Blvd, Elk Grove, CA 95757", phone: "(916) 555-0142", provider: providers[2], plan: plans[1], attributionPeriodStart: "2025-02-01", attributionPeriodEnd: "2025-09-30", status: "new", changeReason: "PCP selection", changeDate: "2025-02-01" },
  { id: "m-043", memberId: "MBR-10276", subscriberId: "SUB-50043", firstName: "Scott", lastName: "Parker", dateOfBirth: "1977-12-20", age: 47, gender: "Male", address: "323 Boxwood Way, Sacramento, CA 95835", phone: "(916) 555-0143", provider: providers[2], plan: plans[0], attributionPeriodStart: "2025-02-01", attributionPeriodEnd: "2025-06-30", status: "new", changeReason: "Manual add", changeDate: "2025-02-01" },
  { id: "m-044", memberId: "MBR-10277", subscriberId: "SUB-50044", firstName: "Stephanie", lastName: "Evans", dateOfBirth: "1983-03-31", age: 41, gender: "Female", address: "434 Yew Ct, Rancho Cordova, CA 95742", phone: "(916) 555-0144", provider: providers[0], plan: plans[2], attributionPeriodStart: "2025-02-01", attributionPeriodEnd: "2025-12-31", status: "new", changeReason: "Returning member", changeDate: "2025-02-01" },
  { id: "m-045", memberId: "MBR-10278", subscriberId: "SUB-50045", firstName: "Gregory", lastName: "Edwards", dateOfBirth: "1965-10-15", age: 59, gender: "Male", address: "545 Katsura Dr, Citrus Heights, CA 95610", phone: "(916) 555-0145", provider: providers[1], plan: plans[1], attributionPeriodStart: "2025-02-01", attributionPeriodEnd: "2025-09-30", status: "new", changeReason: "New enrollment", changeDate: "2025-02-01" },
];

const removedMembers: Omit<Member, "history">[] = [
  { id: "m-046", memberId: "MBR-10279", subscriberId: "SUB-50046", firstName: "Frank", lastName: "Collins", dateOfBirth: "1950-06-12", age: 74, gender: "Male", address: "656 Hackberry Rd, Sacramento, CA 95817", phone: "(916) 555-0146", provider: providers[0], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-01-31", status: "removed", changeReason: "Coverage terminated", changeDate: "2025-02-01" },
  { id: "m-047", memberId: "MBR-10280", subscriberId: "SUB-50047", firstName: "Virginia", lastName: "Stewart", dateOfBirth: "1972-08-24", age: 52, gender: "Female", address: "767 Hornbeam Ave, Folsom, CA 95630", phone: "(916) 555-0147", provider: providers[0], plan: plans[1], attributionPeriodStart: "2024-10-01", attributionPeriodEnd: "2025-01-31", status: "removed", changeReason: "Moved out of area", changeDate: "2025-02-01" },
  { id: "m-048", memberId: "MBR-10281", subscriberId: "SUB-50048", firstName: "Raymond", lastName: "Sanchez", dateOfBirth: "1968-02-07", age: 56, gender: "Male", address: "878 Serviceberry Ln, Roseville, CA 95661", phone: "(916) 555-0148", provider: providers[1], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-01-31", status: "removed", changeReason: "Reassigned to different provider", changeDate: "2025-02-01" },
  { id: "m-049", memberId: "MBR-10282", subscriberId: "SUB-50049", firstName: "Catherine", lastName: "Morris", dateOfBirth: "1959-11-19", age: 65, gender: "Female", address: "989 Silverbell Ct, Davis, CA 95618", phone: "(530) 555-0149", provider: providers[2], plan: plans[2], attributionPeriodStart: "2024-01-01", attributionPeriodEnd: "2025-01-31", status: "removed", changeReason: "Disenrollment", changeDate: "2025-02-01" },
  { id: "m-050", memberId: "MBR-10283", subscriberId: "SUB-50050", firstName: "Eugene", lastName: "Rogers", dateOfBirth: "1946-05-30", age: 78, gender: "Male", address: "100 Yellowwood Way, Elk Grove, CA 95624", phone: "(916) 555-0150", provider: providers[2], plan: plans[0], attributionPeriodStart: "2024-07-01", attributionPeriodEnd: "2025-01-31", status: "removed", changeReason: "Deceased", changeDate: "2025-01-15" },
];

export const allMembers: Member[] = [
  ...activeMembers.map(m => ({ ...m, history: makeHistory(m.status, m.changeReason) })),
  ...newMembers.map(m => ({ ...m, history: makeHistory(m.status, m.changeReason) })),
  ...removedMembers.map(m => ({ ...m, history: makeHistory(m.status, m.changeReason) })),
];

export const trendData = [
  { month: "Sep 2024", members: 39 },
  { month: "Oct 2024", members: 41 },
  { month: "Nov 2024", members: 42 },
  { month: "Dec 2024", members: 42 },
  { month: "Jan 2025", members: 42 },
  { month: "Feb 2025", members: 45 },
];

export const summaryStats = {
  totalActive: activeMembers.length + newMembers.length,
  netChange: newMembers.length - removedMembers.length,
  newThisMonth: newMembers.length,
  removedThisMonth: removedMembers.length,
  previousMonthTotal: activeMembers.length + removedMembers.length,
};

export const allProviders = providers;
export const allPlans = plans;

export function getMemberById(id: string): Member | undefined {
  return allMembers.find(m => m.id === id);
}
