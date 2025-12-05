import React from 'react'
import Side from '../../components/admin/dashbord/Side'
import NavAdmin from '../../components/admin/dashbord/NavAdmin'
import AdminWeddingFilter from '../../components/admin/wedding/AdminWeddingFilter'
import { Outlet, useLocation } from 'react-router-dom'
import WeddingHome from '../../components/admin/wedding/WeddingHome'

const WeddingAdmin = () => {

  const location = useLocation();

  // Show WeddingHome ONLY on main route
  const showHome =
    location.pathname === "/admin/wedding" ||
    location.pathname === "/admin/wedding/";

  return (
    <div className="flex">

      {/* Sidebar */}
      <div className="w-[300px] fixed left-0 top-0 h-screen bg-white shadow">
        <Side/>     
      </div>

      {/* Main Section */}
      <div className="ml-[300px] w-full">

        {/* Top Navbar */}
        <NavAdmin/>

        <div className="p-6">
          
          {/* Filter Always Visible */}
          <AdminWeddingFilter/>

          {/* Show Home Only on /admin/wedding */}
          {showHome && <WeddingHome/>}

          {/* Sub-pages show in Outlet */}
          {!showHome && <Outlet/>}

        </div>

      </div>

    </div>
  )
}

export default WeddingAdmin
