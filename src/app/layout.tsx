import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meu Carrinho",
  description: "Your shopping companion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
