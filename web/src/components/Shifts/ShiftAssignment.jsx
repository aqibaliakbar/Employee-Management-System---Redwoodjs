import { Calendar } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { ShiftAssignmentForm } from "./ShiftAssignmentForm"

export const ShiftAssignment = ({ employeeId }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Assign Shift
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Shift</DialogTitle>
        </DialogHeader>
        <ShiftAssignmentForm
          employeeId={employeeId}
          onSuccess={() => setDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ShiftAssignment