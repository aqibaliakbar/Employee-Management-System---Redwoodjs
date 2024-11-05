import { MetaTags } from '@redwoodjs/web'
import EmployeeStats from 'src/components/Employee/EmployeeStats'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card'

const HomePage = () => {
  const monthlyData = [
    { name: 'Jan', employees: 145, salary: 72000 },
    { name: 'Feb', employees: 148, salary: 73000 },
    { name: 'Mar', employees: 152, salary: 74000 },
    { name: 'Apr', employees: 156, salary: 75000 },
  ]

  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <EmployeeStats />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Employee Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart width={500} height={300} data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="employees" stroke="#8884d8" />
              </LineChart>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Salary Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart width={500} height={300} data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="salary" stroke="#82ca9d" />
              </LineChart>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default HomePage
