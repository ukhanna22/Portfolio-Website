import { todo } from "./todo";

export const beyond = [
  {
    icon: "robot",
    line: "Headed my school's robotics club, designing and building combat robots for inter-school Robowars.",
  },
  {
    icon: "book",
    line: "Wrote a book chapter on Apple's marketing and innovation strategy (Imperial Publications, 2024).",
  },
  {
    icon: "speech",
    line: "Learning German, currently at A1 and negotiating with the Akkusativ.",
  },
  { icon: "spark", line: todo("one more personal line, e.g. strength training or travel") },
] as const;
