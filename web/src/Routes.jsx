// web/src/Routes.jsx
import { Router, Route, Set } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout/MainLayout'
import ShiftsPage from './pages/ShiftPage/ShiftPage'


const Routes = () => {
  return (
    <Router>
      <Set wrap={MainLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Route path="/employees" page={EmployeesPage} name="employees" />
        <Route path="/shifts" page={ShiftsPage} name="shifts" />
        <Route path="/attendance" page={AttendancePage} name="attendance" />
      </Set>
    </Router>
  )
}

export default Routes
