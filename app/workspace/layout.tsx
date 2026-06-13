import { DashboardHeader } from "@/app/components/layout/DashboardHeader";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardHeader />
      <div className="pt-[73px] h-screen overflow-hidden">
        {children}
      </div>
    </>
  );
}
