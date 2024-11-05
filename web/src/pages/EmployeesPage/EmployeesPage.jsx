
import { useState } from 'react'
import { MetaTags } from '@redwoodjs/web'
import { PlusCircle } from 'lucide-react'
import EmployeeForm from 'src/components/Employee/EmployeeForm'
import EmployeeList from 'src/components/Employee/EmployeeList'
import EmployeeGrid from 'src/components/Employee/EmployeeGrid'
import ViewToggle from 'src/components/Employee/ViewToggle'
import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog'

const EmployeesPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [view, setView] = useState('list')

  return (
    <>
      <MetaTags title="Employees" description="Employees page" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
            <p className="text-sm text-muted-foreground">
              Manage your organization's employees
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Add New Employee
                  </DialogTitle>
                </DialogHeader>
                <EmployeeForm
                  onSuccess={() => {
                    setDialogOpen(false)
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {view === 'list' ? <EmployeeList /> : <EmployeeGrid />}
      </div>
    </>
  )
}

export default EmployeesPage
