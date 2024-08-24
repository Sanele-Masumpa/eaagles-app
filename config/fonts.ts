import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

// Define fontSans with additional properties
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap", // Ensures text is visible while the font is loading
  weight: "400", // Sets default weight, adjust as needed
  style: "normal", // Can be "italic" or "normal", adjust as needed
});

// Define fontMono with additional properties
export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap", // Ensures text is visible while the font is loading
  weight: "400", // Sets default weight, adjust as needed
  style: "normal", // Can be "italic" or "normal", adjust as needed
});
