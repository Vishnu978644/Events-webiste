import React from "react";
import Side from "../../components/admin/dashbord/Side";
import NavAdmin from "../../components/admin/dashbord/NavAdmin";
import AdminPlanFilter from "../../components/admin/planning/AdminPlanFilter";
import { Outlet, useLocation } from "react-router-dom";
import PlanningHome from "../../components/admin/planning/PlanningHome";

const PlanningAdmin = () => {
  const location = useLocation();

  const showHome =
    location.pathname === "/admin/planning" ||
    location.pathname === "/admin/planning/";

  return (
    <div className="flex">

      {/* Sidebar */}
      <div className="w-[300px] fixed left-0 top-0 h-screen bg-white shadow">
        <Side />
      </div>

      {/* Main Section */}
      <div className="ml-[300px] w-full">
        <NavAdmin />

        <div className="p-6">

          {/* Show filter ONLY on base route */}
          {showHome && <AdminPlanFilter />}

          {/* Show PlanningHome ONLY on base route */}
          {showHome && <PlanningHome />}

          {/* On sub-routes show only Outlet (NO FILTER) */}
          {!showHome && <Outlet />}

        </div>
      </div>

    </div>
  );
};

export default PlanningAdmin;
