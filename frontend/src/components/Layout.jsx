import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './common/Sidebar'
import Navbar from './common/Navbar'

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div style={{
                marginLeft: sidebarOpen ? '260px' : '72px',
                transition: 'margin-left 0.3s ease',
            }}>
                <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
