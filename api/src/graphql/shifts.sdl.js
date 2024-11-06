export const schema = gql`
  type Shift {
    id: String!
    name: String!
    startTime: String!
    endTime: String!
    employees: [Employee!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Employee {
    id: String!
    firstName: String!
    lastName: String!
    position: String!
    department: String!
    status: EmployeeStatus!
  }

  type ShiftAssignment {
    id: String!
    employeeId: String!
    shiftId: String!
    startDate: String! # Changed from DateTime to String
    endDate: String # Changed from DateTime to String
    status: ShiftAssignmentStatus!
  }

  enum ShiftAssignmentStatus {
    ACTIVE
    INACTIVE
  }

  enum EmployeeStatus {
    ACTIVE
    INACTIVE
  }

  type Query {
    shifts: [Shift!]! @skipAuth
    shift(id: String!): Shift @skipAuth
    employeeShifts(employeeId: String!): [ShiftAssignment!]! @skipAuth
  }

  input CreateShiftInput {
    name: String!
    startTime: String!
    endTime: String!
  }

  input UpdateShiftInput {
    name: String
    startTime: String
    endTime: String
  }

  input CreateShiftAssignmentInput {
    employeeId: String!
    shiftId: String!
    startDate: String! # Changed from DateTime to String
    endDate: String # Changed from DateTime to String
  }

  type Mutation {
    createShift(input: CreateShiftInput!): Shift! @skipAuth
    updateShift(id: String!, input: UpdateShiftInput!): Shift! @skipAuth
    deleteShift(id: String!): Shift! @skipAuth
    createShiftAssignment(input: CreateShiftAssignmentInput!): ShiftAssignment!
      @skipAuth
    updateShiftAssignmentStatus(
      id: String!
      status: ShiftAssignmentStatus!
    ): ShiftAssignment! @skipAuth
    deleteShiftAssignment(id: String!): ShiftAssignment! @skipAuth
    unassignShift(employeeId: String!, shiftId: String!): ShiftAssignment!
      @skipAuth
  }
`
