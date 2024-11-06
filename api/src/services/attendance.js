import { supabase } from 'src/lib/db'
import { format, parseISO, startOfDay, endOfDay } from 'date-fns'

export const attendanceByDate = async ({ date }) => {
  const { data, error } = await supabase
    .from('attendance')
    .select(
      `
      *,
      employee:employees (
        id,
        first_name,
        last_name
      ),
      shift_assignment:shift_assignments (
        shift:shifts (
          name,
          start_time,
          end_time
        )
      )
    `
    )
    .eq('date', date)

  if (error) throw error

  return data.map((record) => ({
    id: record.id,
    employee: {
      id: record.employee.id,
      firstName: record.employee.first_name,
      lastName: record.employee.last_name,
    },
    shiftAssignment: {
      shift: {
        name: record.shift_assignment.shift.name,
        startTime: record.shift_assignment.shift.start_time,
        endTime: record.shift_assignment.shift.end_time,
      },
    },
    date: record.date,
    checkIn: record.check_in,
    checkOut: record.check_out,
    status: record.status,
    notes: record.notes,
  }))
}

export const attendanceStats = async ({ startDate, endDate }) => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)

  if (error) throw error

  const stats = data.reduce(
    (acc, record) => {
      acc[
        `total${record.status.charAt(0) + record.status.slice(1).toLowerCase()}`
      ]++
      return acc
    },
    {
      totalPresent: 0,
      totalAbsent: 0,
      totalHalfDay: 0,
      totalLate: 0,
      totalLeave: 0,
    }
  )

  const totalDays = data.length || 1
  stats.attendancePercentage = (stats.totalPresent / totalDays) * 100

  return stats
}

export const createAttendance = async ({ input }) => {
  const { data, error } = await supabase
    .from('attendance')
    .insert([
      {
        employee_id: input.employeeId,
        shift_assignment_id: input.shiftAssignmentId,
        date: input.date,
        check_in: input.checkIn,
        check_out: input.checkOut,
        status: input.status,
        notes: input.notes,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateAttendance = async ({ id, input }) => {
  const { data, error } = await supabase
    .from('attendance')
    .update({
      check_in: input.checkIn,
      check_out: input.checkOut,
      status: input.status,
      notes: input.notes,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
