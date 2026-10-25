"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

// Das Widget für fremde Seiten (app/kostenrechner/embed): dort kein Header,
// kein Footer, kein Cookie-Banner und keine Messung.
const EINBETTUNG = "/kostenrechner/embed";

export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;
  if (pathname.startsWith("/workspace")) return null;
  if (pathname.startsWith(EINBETTUNG)) return null;
  return <Header />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;
  if (pathname.startsWith("/workspace")) return null;
  if (pathname.startsWith(EINBETTUNG)) return null;
  return <Footer />;
}

/** Cookie-Banner und Analytics: überall außer im eingebetteten Widget. */
export function AusserhalbEinbettung({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith(EINBETTUNG)) return null;
  return <>{children}</>;
}
