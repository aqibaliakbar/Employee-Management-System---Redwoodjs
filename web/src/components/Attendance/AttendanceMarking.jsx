import { useState } from 'react'

import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

import { AttendanceForm } from './AttendanceMarkingForm'

export const AttendanceMarking = ({ attendance, onSuccess }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Button variant="ghost" size="sm" onClick={() => setDialogOpen(true)}>
        Edit
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Attendance</DialogTitle>
        </DialogHeader>
        <AttendanceForm
          attendance={attendance}
          onSuccess={() => {
            setDialogOpen(false)
            onSuccess?.()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AttendanceMarking
