import { format } from 'date-fns'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import AttendanceMarking from './AttendanceMarking'

const AttendanceStatus = {
  PRESENT: { label: 'Present', color: 'bg-green-100 text-green-800' },
  ABSENT: { label: 'Absent', color: 'bg-red-100 text-red-800' },
  HALF_DAY: { label: 'Half Day', color: 'bg-yellow-100 text-yellow-800' },
  LATE: { label: 'Late', color: 'bg-orange-100 text-orange-800' },
  LEAVE: { label: 'Leave', color: 'bg-blue-100 text-blue-800' },
}

export const AttendanceTable = ({ attendanceData }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceData?.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                {record.employee.firstName} {record.employee.lastName}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {record.shiftAssignment.shift.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {format(
                      new Date(
                        `2000-01-01T${record.shiftAssignment.shift.startTime}`
                      ),
                      'hh:mm a'
                    )}{' '}
                    -{' '}
                    {format(
                      new Date(
                        `2000-01-01T${record.shiftAssignment.shift.endTime}`
                      ),
                      'hh:mm a'
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {record.checkIn
                  ? format(new Date(record.checkIn), 'hh:mm a')
                  : '-'}
              </TableCell>
              <TableCell>
                {record.checkOut
                  ? format(new Date(record.checkOut), 'hh:mm a')
                  : '-'}
              </TableCell>
              <TableCell>
                <Badge className={AttendanceStatus[record.status].color}>
                  {AttendanceStatus[record.status].label}
                </Badge>
              </TableCell>
              <TableCell>
                <TableCell>
                  <AttendanceMarking
                    attendance={record}
                    // onSuccess={}
                  />
                </TableCell>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
