// src/components/Sidebar/Sidebar.jsx
import { Link, routes } from '@redwoodjs/router'
import { Users, Building2, Home, Settings } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', routeName: 'home', icon: Home },
  { name: 'Employees', routeName: 'employees', icon: Users },
 
]

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card
        transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
    >
      <div className="flex h-16 items-center justify-center border-b">
        <h1 className="text-xl font-bold text-primary">EMS</h1>
      </div>
      <nav className="mt-4 space-y-1 px-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={routes[item.routeName]()}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                text-muted-foreground hover:bg-accent hover:text-accent-foreground
                transition-colors duration-150"
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
