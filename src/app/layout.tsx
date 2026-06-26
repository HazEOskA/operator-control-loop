import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Operator Loop v0.2 — Operator Control Loop",
  description:
    "Operator Loop v0.2: a controlled, safe-by-design local operator workflow panel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f1117] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
