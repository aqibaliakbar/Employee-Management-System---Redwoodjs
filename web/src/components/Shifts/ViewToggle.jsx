import { Grid, List } from 'lucide-react'
import { Toggle } from 'src/components/ui/toggle'

const ViewToggle = ({ view, onViewChange }) => {
  return (
    <div className="flex space-x-2">
      <Toggle
        pressed={view === 'grid'}
        onPressedChange={() => onViewChange('grid')}
        className="data-[state=on]:bg-muted"
        size="sm"
        aria-label="Grid view"
      >
        <Grid className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={view === 'list'}
        onPressedChange={() => onViewChange('list')}
        className="data-[state=on]:bg-muted"
        size="sm"
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </Toggle>
    </div>
  )
}

export default ViewToggle
