import React, { useState } from 'react'

import Side from '../../components/admin/dashbord/Side'
import NavAdmin from '../../components/admin/dashbord/NavAdmin'
import AdminContactPage from '../../components/admin/contact/AdminContactPage'
import { Outlet, useLocation } from 'react-router-dom'

const ContactAdmin = () => {

  const location = useLocation();

  // show contact home only when route is exactly /admin/contact
  const showContactHome = location.pathname === "/admin/contact";

  return (
    <div className="flex">

      <div className="w-[300px] fixed left-0 top-0 h-screen bg-white shadow">
        <Side/>
      </div>

      <div className="ml-[300px] w-full">
        <NavAdmin/>

        <div className="p-6">
          {showContactHome && <AdminContactPage />}
          <Outlet />
        </div>
      </div>

    </div>
  )
}

export default ContactAdmin;
