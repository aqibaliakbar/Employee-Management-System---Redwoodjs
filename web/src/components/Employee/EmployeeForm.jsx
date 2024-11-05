import { useEffect, useState } from 'react'

import { useMutation } from '@redwoodjs/web'

import { toast } from 'src/hooks/use-toast'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

const GET_EMPLOYEES = gql`
  query EmployeesQuery {
    employees {
      id
      firstName
      lastName
      email
      position
      department
      salary
      startDate
      status
    }
  }
`

const CREATE_EMPLOYEE = gql`
  mutation CreateEmployeeMutation($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
    }
  }
`

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployeeMutation($id: String!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
    }
  }
`

const EmployeeForm = ({ employee, onSuccess, isEdit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    salary: '',
    startDate: '',
    status: 'ACTIVE',
  })

  useEffect(() => {
    if (employee && isEdit) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        position: employee.position,
        department: employee.department,
        salary: employee.salary.toString(),
        startDate: employee.startDate,
        status: employee.status,
      })
    }
  }, [employee, isEdit])

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Employee created successfully',
      })
      onSuccess?.() // Ensure the dialog closes on success
    },
    refetchQueries: [{ query: GET_EMPLOYEES }],
  })

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Employee updated successfully',
      })
      onSuccess?.()
    },
    refetchQueries: [{ query: GET_EMPLOYEES }],
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const variables = {
      input: {
        ...formData,
        salary: parseFloat(formData.salary),
      },
    }

    try {
      if (isEdit) {
        await updateEmployee({
          variables: {
            id: employee.id,
            ...variables,
          },
        })
      } else {
        await createEmployee({ variables })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select
            value={formData.department}
            onValueChange={(value) =>
              setFormData({ ...formData, department: value })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            type="number"
            value={formData.salary}
            onChange={(e) =>
              setFormData({ ...formData, salary: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Create Employee
      </Button>
    </form>
  )
}

export default EmployeeForm
