"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;
  if (pathname.startsWith("/workspace")) return null;
  return <Header />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;
  if (pathname.startsWith("/workspace")) return null;
  return <Footer />;
}
