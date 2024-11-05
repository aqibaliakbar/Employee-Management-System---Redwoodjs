// api/src/services/employees/employees.js
import { supabase } from 'src/lib/db'

export const employees = async () => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return []
    }

    return (data || []).map((record) => ({
      id: record.id,
      firstName: record.first_name,
      lastName: record.last_name,
      email: record.email,
      position: record.position,
      department: record.department,
      salary: parseFloat(record.salary),
      startDate: record.start_date,
      status: record.status,
    }))
  } catch (error) {
    console.error('Error in employees query:', error)
    return []
  }
}

export const employee = async ({ id }) => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    position: data.position,
    department: data.department,
    salary: parseFloat(data.salary),
    startDate: data.start_date,
    status: data.status,
  }
}

export const employeeStats = async () => {
  const { data, error } = await supabase.from('employees').select('*')

  if (error) throw error

  const stats = {
    totalEmployees: data.length,
    averageSalary:
      data.reduce((acc, emp) => acc + parseFloat(emp.salary), 0) / data.length,
    departmentCount: new Set(data.map((emp) => emp.department)).size,
    averageTenure: calculateAverageTenure(data),
  }

  return stats
}

export const createEmployee = async ({ input }) => {
  const employeeData = {
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    position: input.position,
    department: input.department,
    salary: parseFloat(input.salary),
    start_date: input.startDate,
    status: input.status,
  }

  const { data, error } = await supabase
    .from('employees')
    .insert([employeeData])
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    position: data.position,
    department: data.department,
    salary: parseFloat(data.salary),
    startDate: data.start_date,
    status: data.status,
  }
}

export const updateEmployee = async ({ id, input }) => {
  const updateData = {
    ...(input.firstName && { first_name: input.firstName }),
    ...(input.lastName && { last_name: input.lastName }),
    ...(input.email && { email: input.email }),
    ...(input.position && { position: input.position }),
    ...(input.department && { department: input.department }),
    ...(input.salary && { salary: parseFloat(input.salary) }),
    ...(input.startDate && { start_date: input.startDate }),
    ...(input.status && { status: input.status }),
  }

  const { data, error } = await supabase
    .from('employees')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    position: data.position,
    department: data.department,
    salary: parseFloat(data.salary),
    startDate: data.start_date,
    status: data.status,
  }
}

export const deleteEmployee = async ({ id }) => {
  const { data, error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    position: data.position,
    department: data.department,
    salary: parseFloat(data.salary),
    startDate: data.start_date,
    status: data.status,
  }
}

const calculateAverageTenure = (employees) => {
  const now = new Date()
  const tenures = employees.map((emp) => {
    const startDate = new Date(emp.start_date)
    return (now - startDate) / (1000 * 60 * 60 * 24 * 365) // Years
  })
  return tenures.reduce((acc, tenure) => acc + tenure, 0) / tenures.length
}
