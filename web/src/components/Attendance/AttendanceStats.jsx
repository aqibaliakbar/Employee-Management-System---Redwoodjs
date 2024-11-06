import { Calendar, Clock, UserCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export const AttendanceStats = ({ stats }) => {
  const statCards = [
    { title: 'Present', value: stats?.totalPresent, icon: UserCheck },
    { title: 'Absent', value: stats?.totalAbsent, icon: UserCheck },
    { title: 'Half Day', value: stats?.totalHalfDay, icon: UserCheck },
    { title: 'Late', value: stats?.totalLate, icon: Clock },
    { title: 'Leave', value: stats?.totalLeave, icon: Calendar },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {statCards?.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.title === 'Present' && (
                <p className="text-xs text-muted-foreground">
                  {stats?.attendancePercentage.toFixed(1)}% attendance rate
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
