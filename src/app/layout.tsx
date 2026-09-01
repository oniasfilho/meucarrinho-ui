import type { Metadata } from "next";

import { Providers } from "./providers";

import "@/shared/styles/globals.css";

export const metadata: Metadata = {
  title: "MeuCarrinho",
  description: "Acompanhe suas compras em tempo real.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
