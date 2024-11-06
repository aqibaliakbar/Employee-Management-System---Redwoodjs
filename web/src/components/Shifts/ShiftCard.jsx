import { format } from 'date-fns'
import { Trash2, UsersIcon } from 'lucide-react'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { useState } from 'react'

export const ShiftCard = ({ shift, onDelete }) => {
  const [showEmployees, setShowEmployees] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{shift.name}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmployees(!showEmployees)}
            >
              <UsersIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(shift.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        <CardDescription>
          {format(new Date(`2000-01-01T${shift.startTime}`), 'hh:mm a')} -{' '}
          {format(new Date(`2000-01-01T${shift.endTime}`), 'hh:mm a')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{shift.employees.length} Employees Assigned</span>
        </div>
        {showEmployees && shift.employees.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium">Assigned Employees</div>
            <div className="flex flex-wrap gap-2">
              {shift.employees.map((employee) => (
                <Badge key={employee.id} variant="secondary">
                  {employee.firstName} {employee.lastName}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
