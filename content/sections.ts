/** Section order drives the nav, the ⌘K palette, the terminal and the particle field. */
export type FieldState = "noise" | "sphere" | "helix" | "grid" | "rings" | "clusters" | "point";

export const sections = [
  { id: "top", label: "Home", number: "00", field: "noise", nav: false },
  { id: "about", label: "About", number: "01", field: "sphere", nav: true },
  { id: "experience", label: "Experience", number: "02", field: "helix", nav: true },
  { id: "work", label: "Work", number: "03", field: "grid", nav: true },
  { id: "research", label: "Research", number: "04", field: "rings", nav: true },
  { id: "skills", label: "Skills", number: "05", field: "clusters", nav: false },
  { id: "education", label: "Education", number: "06", field: "rings", nav: false },
  { id: "beyond", label: "Beyond the code", number: "07", field: "clusters", nav: false },
  { id: "contact", label: "Contact", number: "08", field: "point", nav: true },
] as const satisfies readonly {
  id: string;
  label: string;
  number: string;
  field: FieldState;
  nav: boolean;
}[];

export type SectionId = (typeof sections)[number]["id"];
export const section = (id: SectionId) => sections.find((s) => s.id === id)!;
