// src/components/Header/Header.jsx
import { Menu } from 'lucide-react'
import { Button } from 'src/components/ui/button'

const Header = ({ onMenuClick }) => {
  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">
            Employee Management System
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header
