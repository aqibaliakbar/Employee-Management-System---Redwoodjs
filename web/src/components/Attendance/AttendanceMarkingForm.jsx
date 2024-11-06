import React, { useState } from 'react'
import { useMutation, useQuery } from '@redwoodjs/web'
import { format } from 'date-fns'
import { Button } from 'src/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select'
import { Input } from 'src/components/ui/input'
import { Textarea } from 'src/components/ui/textarea'
import { useToast } from 'src/hooks/use-toast'
import { Label } from 'src/components/ui/label'

const GET_EMPLOYEES_AND_SHIFTS = gql`
  query GetEmployeesAndShifts {
    employees {
      id
      firstName
      lastName
    }
    shifts {
      id
      name
      startTime
      endTime
    }
  }
`

const UPDATE_ATTENDANCE = gql`
  mutation UpdateAttendanceMutation(
    $id: String!
    $input: UpdateAttendanceInput!
  ) {
    updateAttendance(id: $id, input: $input) {
      id
      status
      checkIn
      checkOut
      notes
    }
  }
`

const CREATE_ATTENDANCE = gql`
  mutation CreateAttendanceMutation($input: CreateAttendanceInput!) {
    createAttendance(input: $input) {
      id
      status
      checkIn
      checkOut
      notes
    }
  }
`

export const AttendanceForm = ({ attendance, date, onSuccess }) => {
  const { toast } = useToast()
  const { data: lookupData } = useQuery(GET_EMPLOYEES_AND_SHIFTS)

  const [formData, setFormData] = useState({
    status: attendance?.status || 'PRESENT',
    employeeId: attendance?.employeeId || '',
    shiftAssignmentId: attendance?.shiftAssignmentId || '',
    checkIn: attendance?.checkIn
      ? format(new Date(attendance.checkIn), 'HH:mm')
      : '',
    checkOut: attendance?.checkOut
      ? format(new Date(attendance.checkOut), 'HH:mm')
      : '',
    notes: attendance?.notes || '',
  })

  const [updateAttendance] = useMutation(UPDATE_ATTENDANCE, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Attendance updated successfully',
      })
      onSuccess?.()
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const [createAttendance] = useMutation(CREATE_ATTENDANCE, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Attendance marked successfully',
      })
      onSuccess?.()
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const targetDate = attendance?.date ? new Date(attendance.date) : date
    const formattedDate = format(targetDate, "yyyy-MM-dd'T'HH:mm:ss'Z'")

    const input = {
      employeeId: formData.employeeId,
      shiftAssignmentId: formData.shiftAssignmentId,
      status: formData.status,
      notes: formData.notes,
      date: formattedDate,
    }

    if (formData.checkIn) {
      const checkInDate = new Date(targetDate)
      const [hours, minutes] = formData.checkIn.split(':')
      checkInDate.setHours(parseInt(hours), parseInt(minutes), 0)
      input.checkIn = checkInDate.toISOString()
    }

    if (formData.checkOut) {
      const checkOutDate = new Date(targetDate)
      const [hours, minutes] = formData.checkOut.split(':')
      checkOutDate.setHours(parseInt(hours), parseInt(minutes), 0)
      input.checkOut = checkOutDate.toISOString()
    }

    try {
      if (attendance?.id) {
        await updateAttendance({
          variables: {
            id: attendance.id,
            input,
          },
        })
      } else {
        await createAttendance({
          variables: {
            input,
          },
        })
      }
    } catch (error) {
      console.error('Error handling attendance:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="employee">Employee</Label>
        <Select
          value={formData.employeeId}
          onValueChange={(value) =>
            setFormData({ ...formData, employeeId: value })
          }
        >
          <SelectTrigger id="employee">
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {lookupData?.employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shift">Shift</Label>
        <Select
          value={formData.shiftAssignmentId}
          onValueChange={(value) =>
            setFormData({ ...formData, shiftAssignmentId: value })
          }
        >
          <SelectTrigger id="shift">
            <SelectValue placeholder="Select shift" />
          </SelectTrigger>
          <SelectContent>
            {lookupData?.shifts.map((shift) => (
              <SelectItem key={shift.id} value={shift.id}>
                {shift.name} (
                {format(new Date(`2000-01-01T${shift.startTime}`), 'HH:mm')} -
                {format(new Date(`2000-01-01T${shift.endTime}`), 'HH:mm')})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRESENT">Present</SelectItem>
            <SelectItem value="ABSENT">Absent</SelectItem>
            <SelectItem value="HALF_DAY">Half Day</SelectItem>
            <SelectItem value="LATE">Late</SelectItem>
            <SelectItem value="LEAVE">Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.status !== 'ABSENT' && formData.status !== 'LEAVE' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="checkIn">Check In</Label>
            <Input
              id="checkIn"
              type="time"
              value={formData.checkIn}
              onChange={(e) =>
                setFormData({ ...formData, checkIn: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkOut">Check Out</Label>
            <Input
              id="checkOut"
              type="time"
              value={formData.checkOut}
              onChange={(e) =>
                setFormData({ ...formData, checkOut: e.target.value })
              }
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional notes..."
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!formData.employeeId || !formData.shiftAssignmentId}
      >
        {attendance ? 'Update Attendance' : 'Mark Attendance'}
      </Button>
    </form>
  )
}
