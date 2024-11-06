import { useState } from 'react'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { MetaTags } from '@redwoodjs/web'

import { AttendanceForm } from 'src/components/Attendance/AttendanceMarkingForm'
import { AttendanceStats } from 'src/components/Attendance/AttendanceStats'
import { AttendanceTable } from 'src/components/Attendance/AttendanceTable'
import { Button } from 'src/components/ui/button'
import { Calendar } from 'src/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select'

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false)

  return (
    <>
      <MetaTags title="Attendance" description="Track employee attendance" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
            <p className="text-sm text-muted-foreground">
              Track and manage employee attendance
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Select
              value={format(selectedDate, 'yyyy-MM')}
              onValueChange={(value) => {
                const [year, month] = value.split('-')
                setSelectedDate(new Date(year, month - 1))
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue>{format(selectedDate, 'MMMM yyyy')}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date(2024, i)
                  return (
                    <SelectItem key={i} value={format(date, 'yyyy-MM')}>
                      {format(date, 'MMMM yyyy')}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            <Button
              onClick={() => setIsMarkingAttendance(true)}
              className="flex items-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              Mark Attendance
            </Button>
          </div>
        </div>

        <AttendanceStats selectedDate={selectedDate} />

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance</CardTitle>
              <CardDescription>
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceTable selectedDate={selectedDate} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        <Dialog
          open={isMarkingAttendance}
          onOpenChange={setIsMarkingAttendance}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Mark Attendance</DialogTitle>
              <DialogDescription>
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            <AttendanceForm
              date={selectedDate}
              onSuccess={() => setIsMarkingAttendance(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default AttendancePage
