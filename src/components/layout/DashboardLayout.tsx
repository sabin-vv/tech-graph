"use client"
import { ReactNode, useState } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

interface DashBoardProps {
  children: ReactNode
}

const DashboardLayout = ({ children }: DashBoardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-dvh w-full">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>
      <div className="flex w-full flex-col overflow-hidden">
        <div className="shrink-0">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        <main className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </main>
      </div>
    </div>
  )
}
export default DashboardLayout
