// src/components/Employee/EmployeeStats.jsx
import { useQuery } from '@redwoodjs/web'
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card'
import { Users, DollarSign, Building2, Clock } from 'lucide-react'
import Loading from '../Loading'


const GET_EMPLOYEE_STATS = gql`
  query GetEmployeeStats {
    employeeStats {
      totalEmployees
      averageSalary
      departmentCount
      averageTenure
    }
  }
`

const EmployeeStats = () => {
  const { data, loading } = useQuery(GET_EMPLOYEE_STATS)

  if (loading) return <Loading />

  const stats = [
    {
      title: 'Total Employees',
      value: data?.employeeStats.totalEmployees || 0,
      icon: Users,
    },
    {
      title: 'Average Salary',
      value: `$${Math.round(data?.employeeStats.averageSalary || 0).toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: 'Departments',
      value: data?.employeeStats.departmentCount || 0,
      icon: Building2,
    },
    {
      title: 'Avg. Tenure',
      value: `${data?.employeeStats.averageTenure.toFixed(1) || 0} yrs`,
      icon: Clock,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.title}
            className="transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default EmployeeStats
