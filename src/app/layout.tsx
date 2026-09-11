import type { Metadata } from "next";
import { Crimson_Pro, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

/* Atkinson Hyperlegible was designed by the Braille Institute to keep similar
   letterforms distinguishable at small sizes. In a timed test where a candidate
   misreading "l" for "1" costs a mark, that is the right default for UI. */
const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

/* Crimson Pro carries the long-form reading passages. Serif at reading length is
   what the candidate will meet in the real texts. */
const crimson = Crimson_Pro({
  variable: "--font-crimson",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IELTS Practise",
  description:
    "Full mock tests and single-section practice for the computer-delivered IELTS, with band scores and a report on what to fix.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-contrast="black-on-white" data-textsize="normal">
      <body className={`${atkinson.variable} ${crimson.variable}`}>
        {children}
      </body>
    </html>
  );
}
