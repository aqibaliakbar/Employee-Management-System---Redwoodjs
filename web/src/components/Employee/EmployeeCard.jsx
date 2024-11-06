import {
  Briefcase,
  Building2,
  Mail,
  Calendar,
  CircleDollarSign,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar'
import { Badge } from 'src/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'
import { getAvatarUrl } from 'src/lib/avatar'

const EmployeeCard = ({ employee }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const getStatusColor = (status) => {
    return status === 'ACTIVE'
      ? 'bg-emerald-950/20 text-black'
      : 'bg-red-950 text-red-400'
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:bg-accent">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-20 w-20 ring-2 ring-primary/20">
            <AvatarImage
              src={getAvatarUrl(
                employee.firstName,
                employee.lastName,
                employee.email
              )}
              alt={`${employee.firstName} ${employee.lastName}`}
            />
            <AvatarFallback className="bg-accent text-accent-foreground">
              {getInitials(employee.firstName, employee.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center">
            <CardTitle className="text-xl font-semibold">
              {employee.firstName} {employee.lastName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
            <Badge
              variant="outline"
              className={getStatusColor(employee.status)}
            >
              {employee.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex items-center gap-3 rounded-lg bg-accent p-3">
          <div className="rounded-md bg-background p-1.5">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Department</p>
            <p className="text-sm text-muted-foreground">
              {employee.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-accent p-3">
          <div className="rounded-md bg-background p-1.5">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Email</p>
            <p className="text-sm text-muted-foreground truncate">
              {employee.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-accent p-3">
          <div className="rounded-md bg-background p-1.5">
            <CircleDollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Salary</p>
            <p className="text-sm text-muted-foreground">
              ${Number(employee.salary).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-accent p-3">
          <div className="rounded-md bg-background p-1.5">
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
