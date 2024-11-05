// src/layouts/MainLayout/MainLayout.jsx
import { useState } from 'react'
import Sidebar from '../Sidebar'
import Header from '../Header'


const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-col transition-all duration-300 md:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-6">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
