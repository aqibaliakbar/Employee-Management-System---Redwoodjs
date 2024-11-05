// api/src/graphql/employees.sdl.js
export const schema = gql`
  type Employee {
    id: String!
    firstName: String!
    lastName: String!
    email: String!
    position: String!
    department: String!
    salary: Float!
    startDate: String!
    status: EmployeeStatus!
  }

  enum EmployeeStatus {
    ACTIVE
    INACTIVE
  }

  type Query {
    employees: [Employee!]! @skipAuth
    employee(id: String!): Employee @skipAuth
    employeeStats: EmployeeStats! @skipAuth
  }

  type EmployeeStats {
    totalEmployees: Int!
    averageSalary: Float!
    departmentCount: Int!
    averageTenure: Float!
  }

  input CreateEmployeeInput {
    firstName: String!
    lastName: String!
    email: String!
    position: String!
    department: String!
    salary: Float!
    startDate: String!
    status: EmployeeStatus!
  }

  input UpdateEmployeeInput {
    firstName: String
    lastName: String
    email: String
    position: String
    department: String
    salary: Float
    startDate: String
    status: EmployeeStatus
  }

  type Mutation {
    createEmployee(input: CreateEmployeeInput!): Employee! @skipAuth
    updateEmployee(id: String!, input: UpdateEmployeeInput!): Employee!
      @skipAuth
    deleteEmployee(id: String!): Employee! @skipAuth
  }
`
