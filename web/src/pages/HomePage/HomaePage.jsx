import { MetaTags } from '@redwoodjs/web'
import { useQuery } from '@redwoodjs/web'

import EmployeeStats from 'src/components/Employee/EmployeeStats'
import Loading from 'src/components/Loading'
import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar'
import { Badge } from 'src/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/table'
import { getAvatarUrl } from 'src/lib/avatar'

const GET_DASHBOARD_DATA = gql`
  query DashboardData {
    employees {
      id
      firstName
      lastName
      email
      position
      department
      salary
      startDate
      status
    }
    employeeStats {
      totalEmployees
      averageSalary
      departmentCount
      averageTenure
    }
  }
`

const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const HomePage = () => {
  const { data, loading } = useQuery(GET_DASHBOARD_DATA)

  // Get top earners - create a new array before sorting
  const topEarners = data?.employees
    ? [...data.employees].sort((a, b) => b.salary - a.salary).slice(0, 5)
    : []

  // Get newest employees - create a new array before sorting
  const recentHires = data?.employees
    ? [...data.employees]
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .slice(0, 5)
    : []

  // Get department distribution
  const departmentStats =
    data?.employees?.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1
      return acc
    }, {}) || {}

  if (loading)
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="text-primary">
          <Loading />
        </div>
      </div>
    )

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    )

  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>

        <EmployeeStats />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Earners */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Top Performers</CardTitle>
              <CardDescription>Highest earning employees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topEarners.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between rounded-lg bg-secondary p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={getAvatarUrl(
                            employee.firstName,
                            employee.lastName,
                            employee.email
                          )}
                        />
                        <AvatarFallback>
                          {getInitials(employee.firstName, employee.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {employee.position}
                        </p>
                      </div>
                    </div>
                    <p className="text-primary">
                      ${employee.salary.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Hires */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Recent Hires</CardTitle>
              <CardDescription>Newest team members</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Start Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentHires.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={getAvatarUrl(
                                employee.firstName,
                                employee.lastName,
                                employee.email
                              )}
                            />
                            <AvatarFallback>
                              {getInitials(
                                employee.firstName,
                                employee.lastName
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            {employee.firstName} {employee.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        {new Date(employee.startDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Department Overview</CardTitle>
            <CardDescription>
              Employee distribution by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(departmentStats || {}).map(([dept, count]) => (
                <div
                  key={dept}
                  className="flex items-center justify-between rounded-lg bg-secondary p-4"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="text-lg font-semibold text-primary">{dept}</p>
                  </div>
                  <Badge variant="outline" className="text-lg">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default HomePage
