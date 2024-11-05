
// src/components/Employee/EmployeeGrid.jsx
import { useQuery } from '@redwoodjs/web'
import Loading from '../Loading'
import EmployeeCard from './EmployeeCard'


const GET_EMPLOYEES = gql`
  query EmployeesQuery {
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
  }
`

const EmployeeGrid = () => {
  const { data, loading, error } = useQuery(GET_EMPLOYEES)

  if (loading) return <Loading />
  if (error) return <div className="text-destructive">Error: {error.message}</div>

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  )
}

export default EmployeeGrid
