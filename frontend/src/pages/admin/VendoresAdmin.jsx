import React from 'react'
import Side from '../../components/admin/dashbord/Side'
import NavAdmin from '../../components/admin/dashbord/NavAdmin'
import AdminVendoreFilter from '../../components/admin/vendores/AdminVendoreFilter'
import { Outlet, useLocation } from 'react-router-dom'
import VendoreHome from '../../components/admin/vendores/VendoreHome'

const VendoresAdmin = () => {

  const location = useLocation();

  // Only show VendorHome on main vendor URL
  const showVendorHome = location.pathname === "/admin/vendore";

  return (
    <div className="flex">

      {/* Sidebar */}
      <div className="w-[300px] fixed left-0 top-0 h-screen bg-white shadow">
        <Side />
      </div>

      {/* Main Area */}
      <div className="ml-[300px] w-full">
        <NavAdmin />

        <div className="p-6">
          
          {/* Filter ALWAYS visible */}
         {showVendorHome &&  <AdminVendoreFilter />}

          {/* Vendor Home visible only on /admin/vendors */}
          {showVendorHome && <VendoreHome />}

          {/* Child pages visible only when NOT on /admin/vendors */}
          {!showVendorHome && <Outlet />}
        </div>

      </div>
    </div>
  )
}

export default VendoresAdmin;
