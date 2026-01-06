import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "日々是Progressive Overload",
  description: "トレーニング記録と成長を実感できるWebアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
