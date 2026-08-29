import { ReactNode } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface DashBoardProps {
    children: ReactNode
}

const DashboardLayout = ({ children }: DashBoardProps) => {
    return (
        <div className="flex gap-5 w-full h-dvh">
            <Sidebar />
            <div className="w-full">
                <Navbar />
                <main className="flex-1 align-middle justify-center">{children}</main>
            </div>
        </div>
    )
}
export default DashboardLayout
