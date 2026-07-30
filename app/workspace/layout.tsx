import { DashboardHeader } from "@/app/components/layout/DashboardHeader";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardHeader />
      {/*
        Fest am Viewport verankert statt `pt-[73px] h-screen`:
        1. `h-screen` + 73px Padding ergab 100vh+73px -> unnoetiger vertikaler Scroll.
        2. Wichtiger: Erzeugt irgendein Element (z. B. der fixed Header) in Firefox
           horizontalen Body-Scroll, wanderte der viewport-breite Shell nach links
           aus dem Bild und die Sidebar war weg. Ein fixed Container scrollt nicht mit.
      */}
      <div className="fixed inset-x-0 bottom-0 top-[73px] overflow-hidden">
        {children}
      </div>
    </>
  );
}
