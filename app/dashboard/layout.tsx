import { DashboardHeader } from "@/app/components/layout/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <DashboardHeader />
      {children}
    </div>
  );
}
