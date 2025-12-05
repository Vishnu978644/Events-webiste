import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Side from '../../components/admin/dashbord/Side';
import NavAdmin from '../../components/admin/dashbord/NavAdmin';
import BriGroomFilter from '../../components/admin/bridesgroom/BriGroomFilter';


const BriGroomAdmin = () => {
  const location = useLocation();

  // Show home only on main bride-groom route
  const showHome =
    location.pathname === "/admin/bridegroom" ||
    location.pathname === "/admin/bridegroom/";

  return (
    <div className="flex">

      {/* Sidebar */}
      <div className="w-[300px] fixed left-0 top-0 h-screen bg-white shadow">
        <Side />
      </div>

      {/* Main Content */}
      <div className="ml-[300px] w-full">
        <NavAdmin />

        <div className="p-6">
          <BriGroomFilter />

          {/* Home on main route */}
       

          {/* Child routes */}
          {!showHome && <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default BriGroomAdmin;
