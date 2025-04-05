import QueryProvider from "@/components/QueryProvider";
import "./globals.css"; // Importa estilos globais

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
