import { useState } from 'react'

import { format } from 'date-fns'
import { Calendar as CalendarIcon, Users } from 'lucide-react'
import { Loader2 } from 'lucide-react'

import { useQuery, useMutation } from '@redwoodjs/web'

import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar'
import { Badge } from 'src/components/ui/badge'
import { Button } from 'src/components/ui/button'
import { Calendar } from 'src/components/ui/calendar'
import { Label } from 'src/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'src/components/ui/popover'
import { ScrollArea } from 'src/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select'
import { useToast } from 'src/hooks/use-toast'
import { getAvatarUrl } from 'src/lib/avatar'
import { cn } from 'src/lib/utils'

const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      id
      firstName
      lastName
      position
      department
      status
      email
    }
  }
`

const CREATE_SHIFT_ASSIGNMENT = gql`
  mutation CreateShiftAssignment($input: CreateShiftAssignmentInput!) {
    createShiftAssignment(input: $input) {
      id
      employeeId
      shiftId
      startDate
      status
    }
  }
`

const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

export const ShiftAssignmentForm = ({ selectedShift, onSuccess }) => {
  const { toast } = useToast()
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [date, setDate] = useState(new Date())

  const { data: employeesData, loading: loadingEmployees } =
    useQuery(GET_EMPLOYEES)

  const [createAssignment, { loading: creating }] = useMutation(
    CREATE_SHIFT_ASSIGNMENT,
    {
      onCompleted: () => {
        toast({
          title: 'Success',
          description: 'Employee assigned to shift successfully',
        })
        onSuccess?.()
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to assign shift',
          variant: 'destructive',
        })
      },
      refetchQueries: ['GetShifts'],
    }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedEmployee || !selectedShift?.id) {
      toast({
        title: 'Error',
        description: 'Please select an employee and ensure shift is selected',
        variant: 'destructive',
      })
      return
    }

    try {
      await createAssignment({
        variables: {
          input: {
            employeeId: selectedEmployee,
            shiftId: selectedShift.id,
            startDate: format(date, 'yyyy-MM-dd'),
          },
        },
      })
    } catch (error) {
      console.error('Error assigning shift:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to assign shift',
        variant: 'destructive',
      })
    }
  }

  // Filter out inactive employees and already assigned employees
  const availableEmployees =
    employeesData?.employees.filter((employee) => {
      const isActive = employee.status === 'ACTIVE'
      const isAlreadyAssigned = selectedShift.employees.some(
        (assigned) => assigned.id === employee.id
      )
      return isActive && !isAlreadyAssigned
    }) || []

  const selectedEmployeeData = availableEmployees.find(
    (emp) => emp.id === selectedEmployee
  )

  if (!selectedShift) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shift Info */}
      <div className="rounded-lg bg-muted p-4">
        <h3 className="font-medium text-sm text-muted-foreground mb-2">
          Shift Details
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{selectedShift.name}</p>
            <p className="text-sm text-muted-foreground">
              {format(
                new Date(`2000-01-01T${selectedShift.startTime}`),
                'hh:mm a'
              )}{' '}
              -{' '}
              {format(
                new Date(`2000-01-01T${selectedShift.endTime}`),
                'hh:mm a'
              )}
            </p>
          </div>
          <Badge variant="secondary">
            {selectedShift?.employees?.length} Assigned
          </Badge>
        </div>
      </div>

      {/* Employee Selection */}
      <div className="space-y-2">
        <Label>Select Employee</Label>
        <Select
          value={selectedEmployee}
          onValueChange={setSelectedEmployee}
          disabled={loadingEmployees}
        >
          <SelectTrigger className="h-20">
            <SelectValue
              placeholder={
                loadingEmployees ? 'Loading employees...' : 'Select an employee'
              }
            >
              {selectedEmployeeData && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={getAvatarUrl(
                        selectedEmployeeData.firstName,
                        selectedEmployeeData.lastName,
                        selectedEmployeeData.email
                      )}
                    />
                    <AvatarFallback>
                      {getInitials(
                        selectedEmployeeData.firstName,
                        selectedEmployeeData.lastName
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {selectedEmployeeData.firstName}{' '}
                      {selectedEmployeeData.lastName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {selectedEmployeeData.position} •{' '}
                      {selectedEmployeeData.department}
                    </span>
                  </div>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-72">
              {availableEmployees.map((employee) => (
                <SelectItem
                  key={employee.id}
                  value={employee.id}
                  className="p-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={getAvatarUrl(
                          employee.firstName,
                          employee.lastName,
                          employee.email
                        )}
                      />
                      <AvatarFallback>
                        {getInitials(employee.firstName, employee.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {employee.position} • {employee.department}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
        {availableEmployees?.length === 0 && !loadingEmployees && (
          <p className="text-sm text-muted-foreground mt-2">
            All active employees are already assigned to this shift or no active
            employees are available.
          </p>
        )}
      </div>

      {/* Date Selection */}
      <div className="space-y-2">
        <Label>Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={creating || loadingEmployees || !selectedEmployee}
      >
        {creating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Assigning...
          </>
        ) : (
          'Assign Employee'
        )}
      </Button>

      {/* Currently Assigned */}
      {selectedShift?.employees?.length > 0 && (
        <div className="space-y-2 pt-4 border-t">
          <Label className="text-muted-foreground">Currently Assigned</Label>
          <div className="flex flex-wrap gap-2">
            {selectedShift.employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={getAvatarUrl(
                      employee.firstName,
                      employee.lastName,
                      employee.email
                    )}
                  />
                  <AvatarFallback>
                    {getInitials(employee.firstName, employee.lastName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {employee.firstName} {employee.lastName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  )
}

export default ShiftAssignmentForm
