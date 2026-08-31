import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface DashBoardProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashBoardProps) => {
  return (
    <div className="flex h-dvh w-full">
      <Sidebar />
      <div className="flex w-full flex-col">
        <Navbar />
        <main className="flex-1 justify-center px-6 align-middle">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
