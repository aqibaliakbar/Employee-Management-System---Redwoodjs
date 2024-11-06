import { useState } from 'react'

import { format } from 'date-fns'
import { Pencil, Trash2, Users, UserPlus } from 'lucide-react'

import { useQuery, useMutation } from '@redwoodjs/web'

import { Alert, AlertDescription } from 'src/components/ui/alert'
import { Badge } from 'src/components/ui/badge'
import { Button } from 'src/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from 'src/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog'
import { Skeleton } from 'src/components/ui/skeleton'
import { useToast } from 'src/hooks/use-toast'

import { ShiftAssignmentForm } from './ShiftAssignmentForm'

const GET_SHIFTS = gql`
  query GetShifts {
    shifts {
      id
      name
      startTime
      endTime
      employees {
        id
        firstName
        lastName
        position
        department
        status
      }
    }
  }
`

const DELETE_SHIFT = gql`
  mutation DeleteShift($id: String!) {
    deleteShift(id: $id) {
      id
      name
      startTime
      endTime
    }
  }
`

export const ShiftGrid = () => {
  const { toast } = useToast()
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState(null)
  const { data, loading, error } = useQuery(GET_SHIFTS)

  const [deleteShift] = useMutation(DELETE_SHIFT, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Shift deleted successfully',
      })
    },
    refetchQueries: [{ query: GET_SHIFTS }],
  })

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this shift?')) {
      try {
        await deleteShift({
          variables: { id },
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      }
    }
  }

  const handleAssignShift = (shift) => {
    setSelectedShift(shift)
    setAssignDialogOpen(true)
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading shifts: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.shifts.map((shift) => (
          <Card key={shift.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{shift.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAssignShift(shift)}
                    className="h-8 w-8"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(shift.id)}
                    className="h-8 w-8"
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
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {shift.employees.length} Employees Assigned
                </div>
                {shift.employees.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {shift.employees.map((employee) => (
                      <Badge key={employee.id} variant="secondary">
                        {employee.firstName} {employee.lastName}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {!loading && (!data?.shifts || data.shifts.length === 0) && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="pt-6 text-center text-muted-foreground">
              No shifts found. Create one to get started.
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Employees to {selectedShift?.name}</DialogTitle>
          </DialogHeader>
          {selectedShift && (
            <ShiftAssignmentForm
              shiftId={selectedShift.id}
              onSuccess={() => {
                setAssignDialogOpen(false)
                setSelectedShift(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
