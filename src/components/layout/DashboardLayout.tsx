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
            <div className="w-full flex flex-col">
                <Navbar />
                <main className="flex-1 align-middle justify-center m-1">{children}</main>
            </div>
        </div>
    )
}
export default DashboardLayout
