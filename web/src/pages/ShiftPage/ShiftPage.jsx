import { useState } from 'react'

import { PlusCircle } from 'lucide-react'

import { MetaTags } from '@redwoodjs/web'
import { useQuery, useMutation } from '@redwoodjs/web'

import { ShiftForm } from 'src/components/Shifts/ShiftForm'
import { ShiftList } from 'src/components/Shifts/ShiftList'
import { ShiftTable } from 'src/components/Shifts/ShiftTable'
import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog'

import { useToast } from 'src/hooks/use-toast'
import ViewToggle from 'src/components/Shifts/ViewToggle'

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

const ShiftsPage = () => {
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [view, setView] = useState('grid')

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

  return (
    <>
      <MetaTags title="Shifts" description="Manage employee shifts" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Shifts</h2>
            <p className="text-sm text-muted-foreground">
              Create and manage employee shifts
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Shift
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Shift</DialogTitle>
                </DialogHeader>
                <ShiftForm onSuccess={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {view === 'grid' ? (
          <ShiftList
            shifts={data?.shifts}
            loading={loading}
            error={error}
            onDelete={handleDelete}
          />
        ) : (
          <ShiftTable
            shifts={data?.shifts}
            loading={loading}
            error={error}
            onDelete={handleDelete}
          />
        )}
      </div>
    </>
  )
}

export default ShiftsPage
