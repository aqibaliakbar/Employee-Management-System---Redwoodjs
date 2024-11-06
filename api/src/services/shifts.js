// api/src/services/shifts/shifts.js
import { supabase } from 'src/lib/db'

export const shifts = async () => {
  const { data, error } = await supabase.from('shifts').select(`
    *,
    shift_assignments (
      employee:employees (
        id,
        first_name,
        last_name,
        position,
        department,
        status
      )
    )
  `)

  if (error) throw error

  return data.map((shift) => ({
    id: shift.id,
    name: shift.name,
    startTime: shift.start_time,
    endTime: shift.end_time,
    employees: shift.shift_assignments.map((assignment) => ({
      id: assignment.employee.id,
      firstName: assignment.employee.first_name,
      lastName: assignment.employee.last_name,
      position: assignment.employee.position,
      department: assignment.employee.department,
      status: assignment.employee.status,
    })),
  }))
}

export const updateShift = async ({ id, input }) => {
  const { data, error } = await supabase
    .from('shifts')
    .update({
      name: input.name,
      start_time: input.startTime,
      end_time: input.endTime,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    name: data.name,
    startTime: data.start_time,
    endTime: data.end_time,
  }
}

export const createShift = async ({ input }) => {
  const { data, error } = await supabase
    .from('shifts')
    .insert([
      {
        name: input.name,
        start_time: input.startTime,
        end_time: input.endTime,
      },
    ])
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    name: data.name,
    startTime: data.start_time,
    endTime: data.end_time,
    employees: [], // Add empty employees array for new shifts
  }
}

export const createShiftAssignment = async ({ input }) => {
  // First check if assignment already exists
  const { data: existingAssignment } = await supabase
    .from('shift_assignments')
    .select('*')
    .eq('employee_id', input.employeeId)
    .eq('shift_id', input.shiftId)
    .eq('status', 'ACTIVE')
    .single()

  if (existingAssignment) {
    throw new Error('Employee is already assigned to this shift')
  }

  const { data, error } = await supabase
    .from('shift_assignments')
    .insert([
      {
        employee_id: input.employeeId,
        shift_id: input.shiftId,
        start_date: input.startDate, // Now matches the date column type
        status: 'ACTIVE',
      },
    ])
    .select(
      `
      id,
      employee_id,
      shift_id,
      start_date,
      end_date,
      status,
      employee:employees (
        id,
        first_name,
        last_name,
        position,
        department,
        status
      )
    `
    )
    .single()

  if (error) throw error

  return {
    id: data.id,
    employeeId: data.employee_id,
    shiftId: data.shift_id,
    startDate: data.start_date,
    endDate: data.end_date,
    status: data.status,
    employee: {
      id: data.employee.id,
      firstName: data.employee.first_name,
      lastName: data.employee.last_name,
      position: data.employee.position,
      department: data.employee.department,
      status: data.employee.status,
    },
  }
}

export const unassignShift = async ({ employeeId, shiftId }) => {
  const { data, error } = await supabase
    .from('shift_assignments')
    .update({ status: 'INACTIVE' })
    .eq('employee_id', employeeId)
    .eq('shift_id', shiftId)
    .eq('status', 'ACTIVE')
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    employeeId: data.employee_id,
    shiftId: data.shift_id,
    startDate: data.start_date,
    endDate: data.end_date,
    status: data.status,
  }
}

export const deleteShift = async ({ id }) => {
  const { data, error } = await supabase
    .from('shifts')
    .delete()
    .match({ id })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    name: data.name,
    startTime: data.start_time,
    endTime: data.end_time,
    employees: [], // Add empty employees array for consistency
  }
}
