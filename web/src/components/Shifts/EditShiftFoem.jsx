// src/components/Shifts/EditShiftForm.jsx
import { useState, useEffect } from 'react'

import { Loader2 } from 'lucide-react'

import { useMutation } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import { useToast } from 'src/hooks/use-toast'

const UPDATE_SHIFT = gql`
  mutation UpdateShift($id: String!, $input: UpdateShiftInput!) {
    updateShift(id: $id, input: $input) {
      id
      name
      startTime
      endTime
    }
  }
`

export const EditShiftForm = ({ shift, onSuccess }) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
  })

  useEffect(() => {
    if (shift) {
      setFormData({
        name: shift.name,
        startTime: shift.startTime.slice(0, 5), // Remove seconds
        endTime: shift.endTime.slice(0, 5), // Remove seconds
      })
    }
  }, [shift])

  const [updateShift, { loading }] = useMutation(UPDATE_SHIFT, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Shift updated successfully',
      })
      onSuccess?.()
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.startTime || !formData.endTime) {
      toast({
        title: 'Error',
        description: 'Please fill all fields',
        variant: 'destructive',
      })
      return
    }

    try {
      await updateShift({
        variables: {
          id: shift.id,
          input: {
            name: formData.name,
            startTime: formData.startTime + ':00',
            endTime: formData.endTime + ':00',
          },
        },
      })
    } catch (error) {
      console.error('Error updating shift:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Shift Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Morning Shift"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          'Update Shift'
        )}
      </Button>
    </form>
  )
}

export default EditShiftForm