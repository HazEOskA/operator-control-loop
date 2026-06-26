import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALFA MVP v0.2 — Agent Control Loop",
  description:
    "ALFA Agent Control Loop: a controlled, safe-by-design local agent workflow panel. v0.2 MVP.",
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
