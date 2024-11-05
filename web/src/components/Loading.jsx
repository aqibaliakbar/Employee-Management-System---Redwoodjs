// src/components/ui/loading.jsx
const Loading = () => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-bounce rounded-full bg-primary">
          <span className="sr-only">Loading...</span>
        </div>
        <div
          className="h-4 w-4 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: '0.2s' }}
        >
          <span className="sr-only">Loading...</span>
        </div>
        <div
          className="h-4 w-4 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: '0.4s' }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  )
}

export default Loading
