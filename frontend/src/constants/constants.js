export const Classes = [
  {
    value: "LKG",
    label: "LKG",
  },
  {
    value: "UKG",
    label: "UKG",
  },
  {
    value: "1",
    label: "1",
  },
  {
    value: "2",
    label: "2",
  },
  {
    value: "3",
    label: "3",
  },
  {
    value: "4",
    label: "4",
  },
  {
    value: "5",
    label: "5",
  },
  {
    value: "6",
    label: "6",
  },
  {
    value: "7",
    label: "7",
  },
  {
    value: "8",
    label: "8",
  },
  {
    value: "9",
    label: "9",
  },
  {
    value: "10",
    label: "10",
  },
  {
    value: "11",
    label: "11",
  },
  {
    value: "12",
    label: "12",
  },
];

export const Centres = [
  { label: "C1", value: "C1" },
  { label: "C3", value: "C3" },
  { label: "C5", value: "C5" },
  { label: "C6", value: "C6" },
  { label: "Anganwadi", value: "Anganwadi" },
];

export const SponsorshipStatus = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export const Schools = [
  { label: "Education Academy", value: "Education Academy" },
  { label: "Vidiya Public School", value: "Vidiya Public School" },
  { label: "Vidya Bharti", value: "Vidya Bharti" },
  { label: "Lucious Public School", value: "Lucious Public School" },
  { label: "Tagore Academy", value: "Tagore Academy" },
  { label: "Saraswati Vidya Niketan", value: "Saraswati Vidya Niketan" },
  { label: "Dhanbad Vikas Vidyalaya", value: "Dhanbad Vikas Vidyalaya" },
  { label: "NIOS", value: "NIOS" },
  { label: "ISL Jhariya", value: "ISL Jhariya" },
  { label: "Dhanbad Public School", value: "Dhanbad Public School" },
  { label: "Gurukul", value: "Gurukul" },
  { label: "Physics Wallah", value: "Physics Wallah" },
  { label: "Akash", value: "Akash" },
  { label: "Ram Krishna Public School", value: "Ram Krishna Public School" },
  { label: "Sunshine Children Academy", value: "Sunshine Children Academy" },
  { label: "Kendriya Vidyalaya No.1", value: "Kendriya Vidyalaya No.1" },
  { label: "Kendriya Vidyalaya No.2", value: "Kendriya Vidyalaya No.2" },
  { label: "DY Patil", value: "DY Patil" },
  { label: "DPS Hirak", value: "DPS Hirak" },
  {
    label: "Dr. JK Sinha Memorial (ISL)",
    value: "Dr. JK Sinha Memorial (ISL)",
  },
  { label: "ISL Jharia", value: "ISL Jharia" },
  { label: "St. Xavier", value: "St. Xavier" },
  { label: "Middle School Dhaiya", value: "Middle School Dhaiya" },
];

export const ActiveStatus = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

export const Gender = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

export const resultSession = ["2025-26", "2026-27"];

export const AadharVerifiedStatus = [
  { label: "Verified", value: true },
  { label: "Not Verified", value: false },
];

export const FormRows = [
  [
    {
      name: "studentName",
      componentType: "Input",
      type: "text",
      title: "Name of Student",
      placeholder: "Name",
    },
    {
      name: "gender",
      componentType: "Select",
      title: "Gender",
      placeholder: "Select Gender",
      options: Gender,
    },
  ],
  [
    {
      name: "dob",
      componentType: "Input",
      type: "date",
      title: "Date of birth of Student",
      placeholder: "Date of Birth",
    },
    {
      name: "address",
      componentType: "Input",
      type: "text",
      title: "Address of Student",
      placeholder: "Address",
    },
  ],
  [
    {
      name: "currentSession",
      componentType: "Input",
      type: "text",
      title: "Current Session",
      placeholder: "Session",
    },
    {
      name: "class",
      componentType: "Input",
      type: "text",
      title: "Class of Student",
      placeholder: "Class",
    },
  ],
  [
    {
      name: "centre",
      componentType: "Select",
      title: "Centre",
      placeholder: "Select Centre",
      options: Centres,
    },
    {
      name: "school",
      componentType: "ComboBox",
      title: "School of School",
      placeholder: "Select or Type School",
      options: Schools,
    },
  ],
  [
    {
      name: "fathersName",
      componentType: "Input",
      type: "text",
      title: "Father's Name",
      placeholder: "Father's Name",
    },
    {
      name: "fathersOccupation",
      componentType: "Input",
      type: "text",
      title: "Father's Occupation",
      placeholder: "Father's Occupation",
    },
  ],
  [
    {
      name: "mothersName",
      componentType: "Input",
      type: "text",
      title: "Mother's Name",
      placeholder: "Mother's Name",
    },
    {
      name: "mothersOccupation",
      componentType: "Input",
      type: "text",
      title: "Mother's Occupation",
      placeholder: "Mother's Occupation",
    },
  ],
  [
    {
      name: "annualIncome",
      componentType: "Input",
      type: "number",
      title: "Annual Family Income",
      placeholder: "Family Income",
    },
    {
      name: "contactNumber",
      componentType: "Input",
      type: "text",
      title: "Contact Number",
      placeholder: "Contact Number",
    },
  ],
];

export const DOCUMENT_CHECKBOXES = [
  {
    title: "Profile Aadhar Verified",
    name: "profileAadharVerified",
  },
  {
    title: "Aadhar Card",
    name: "aadhar",
  },
  {
    title: "Domicile Certificate",
    name: "domicile",
  },
  {
    title: "Birth Certificate",
    name: "birthCertificate",
  },
  {
    title: "Disability Certificate",
    name: "disability",
  },
  {
    title: "Single Parent",
    name: "singleParent",
  },
  {
    title: "Do you have relevantCertificate Certificate ?",
    name: "relevantCertificate",
    indent: true,
  },
];
