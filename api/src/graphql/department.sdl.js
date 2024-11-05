export const schema = gql`
  type Department {
    id: String!
    name: String!
    description: String!
    managerId: String!
    employeeCount: Int!
    budget: Float!
  }

  type Query {
    departments: [Department!]! @skipAuth
    department(id: String!): Department @skipAuth
  }

  input CreateDepartmentInput {
    name: String!
    description: String!
    managerId: String!
    budget: Float!
  }

  input UpdateDepartmentInput {
    name: String
    description: String
    managerId: String
    budget: Float
  }

  type Mutation {
    createDepartment(input: CreateDepartmentInput!): Department! @skipAuth
    updateDepartment(id: String!, input: UpdateDepartmentInput!): Department!
      @skipAuth
    deleteDepartment(id: String!): Department! @skipAuth
  }
`
