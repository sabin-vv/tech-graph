import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface DashBoardProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashBoardProps) => {
  return (
    <div className="flex h-dvh w-full gap-5">
      <Sidebar />
      <div className="flex w-full flex-col">
        <Navbar />
        <main className="m-1 flex-1 justify-center align-middle">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
