// src/components/Employee/EmployeeList.jsx
import { useState } from 'react'
import { useQuery, useMutation } from '@redwoodjs/web'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/table'
import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog'
import { toast } from 'src/hooks/use-toast'
import Loading from '../Loading'
import EmployeeForm from './EmployeeForm'


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

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployeeMutation($id: String!) {
    deleteEmployee(id: $id) {
      id
    }
  }
`

const EmployeeList = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const { data, loading, error } = useQuery(GET_EMPLOYEES)
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      })
    },
    refetchQueries: [{ query: GET_EMPLOYEES }],
  })

  if (loading) return <Loading />
  if (error)
    return <div className="text-destructive">Error: {error.message}</div>

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee({ variables: { id } })
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      }
    }
  }

  const handleEdit = (employee) => {
    setSelectedEmployee(employee)
    setEditDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.employees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {employee.firstName} {employee.lastName}
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>${employee.salary.toLocaleString()}</TableCell>
                <TableCell>
                  {new Date(employee.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${
                        employee.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {employee.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(employee)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(employee.id)}
                      className="hover:bg-destructive/90"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            employee={selectedEmployee}
            onSuccess={() => {
              setEditDialogOpen(false)
              setSelectedEmployee(null)
            }}
            isEdit
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EmployeeList
