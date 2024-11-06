import { useState } from 'react'
import { format } from 'date-fns'
import { Pencil, Trash2, UserPlus } from 'lucide-react'
import { Alert, AlertDescription } from 'src/components/ui/alert'
import { Badge } from 'src/components/ui/badge'
import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog'
import { Skeleton } from 'src/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/table'
import { ShiftAssignmentForm } from './ShiftAssignmentForm'
import EditShiftForm from './EditShiftFoem'


export const ShiftTable = ({ shifts, loading, error, onDelete }) => {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState(null)

  const handleAssign = (shift) => {
    setSelectedShift(shift)
    setAssignDialogOpen(true)
  }

  const handleEdit = (shift) => {
    setSelectedShift(shift)
    setEditDialogOpen(true)
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead className="w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts?.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-medium">{shift.name}</TableCell>
                <TableCell>
                  {format(new Date(`2000-01-01T${shift.startTime}`), 'hh:mm a')}{' '}
                  - {format(new Date(`2000-01-01T${shift.endTime}`), 'hh:mm a')}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {shift.employees.map((employee) => (
                      <Badge
                        key={employee.id}
                        variant="secondary"
                        className="truncate max-w-[120px]"
                      >
                        {employee.firstName} {employee.lastName}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAssign(shift)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(shift)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(shift.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && (!shifts || shifts.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground h-24"
                >
                  No shifts found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Employees to {selectedShift?.name}</DialogTitle>
          </DialogHeader>
          <ShiftAssignmentForm
            selectedShift={selectedShift}
            onSuccess={() => {
              setAssignDialogOpen(false)
              setSelectedShift(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
          </DialogHeader>
          <EditShiftForm
            shift={selectedShift}
            onSuccess={() => {
              setEditDialogOpen(false)
              setSelectedShift(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
