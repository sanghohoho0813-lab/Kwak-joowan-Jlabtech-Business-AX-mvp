import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "JLAB TECH AX — Industrial Measurement Business AX",
  description:
    "산업·환경 계측 데이터 기반으로 재고 운영, 장비 추천, 재구매 기회를 관리하는 JLAB TECH AX 플랫폼 MVP",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D3B2E",
};

/** 글자 크기 설정을 첫 페인트 전에 적용해 깜빡임(FOUC)을 막는다 */
const fontSizeInit = `
try {
  var s = JSON.parse(localStorage.getItem("jlab-ax-settings-v1") || "{}");
  if (s.fontSize) document.documentElement.setAttribute("data-fontsize", s.fontSize);
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <script dangerouslySetInnerHTML={{ __html: fontSizeInit }} />
      </head>
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
