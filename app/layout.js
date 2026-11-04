import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-cormorant" });
const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope" });

export const metadata = {
  title: "Addition Cosmetics — Prirodna kozmetika, stručno formulisana",
  description: "Ručno rađena prirodna kozmetika iza koje stoji znanje iz hemije i farmacije. Serumi, kreme i balzami za lice, telo i usne.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr-Latn" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
