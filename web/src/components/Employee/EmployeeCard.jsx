
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from 'src/components/ui/card'
import {
  Briefcase,
  Building2,
  Mail,
  Calendar,
  CircleDollarSign
} from 'lucide-react'
import { Avatar, AvatarFallback } from "src/components/ui/avatar"
import { Badge } from "src/components/ui/badge"

const EmployeeCard = ({ employee }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const getStatusColor = (status) => {
    return status === 'ACTIVE'
      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700'
      : 'bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700'
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/10 text-lg">
              {getInitials(employee.firstName, employee.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center">
            <CardTitle className="text-xl">
              {employee.firstName} {employee.lastName}
            </CardTitle>
            <Badge
              variant="secondary"
              className={getStatusColor(employee.status)}
            >
              {employee.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div className="rounded-md bg-primary/10 p-1">
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Position</p>
            <p className="text-sm text-muted-foreground">
              {employee.position}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div className="rounded-md bg-primary/10 p-1">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Department</p>
            <p className="text-sm text-muted-foreground">
              {employee.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div className="rounded-md bg-primary/10 p-1">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Email</p>
            <p className="text-sm text-muted-foreground truncate">
              {employee.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div className="rounded-md bg-primary/10 p-1">
            <CircleDollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Salary</p>
            <p className="text-sm text-muted-foreground">
              ${Number(employee.salary).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div className="rounded-md bg-primary/10 p-1">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Start Date</p>
            <p className="text-sm text-muted-foreground">
              {new Date(employee.startDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmployeeCard
