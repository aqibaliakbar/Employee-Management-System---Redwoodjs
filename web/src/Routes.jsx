// web/src/Routes.jsx
import { Router, Route, Set } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout/MainLayout'


const Routes = () => {
  return (
    <Router>
      <Set wrap={MainLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Route path="/employees" page={EmployeesPage} name="employees" />
      </Set>
    </Router>
  )
}

export default Routes
