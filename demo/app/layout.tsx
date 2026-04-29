import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "@cp949/react-highlight-words demo",
  description: "Demo for the @cp949/react-highlight-words component",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
