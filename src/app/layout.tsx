import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Lista de Tarefas",
  description: "Aplicativo de lista de tarefas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen antialiased">
        <Navbar />
        <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pt-16 sm:pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
