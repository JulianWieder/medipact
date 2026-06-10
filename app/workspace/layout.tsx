export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  // Kein DashboardHeader – der Workspace hat seine eigene Sidebar
  return <>{children}</>;
}
