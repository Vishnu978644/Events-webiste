import React from "react";
import Side from "../../components/admin/dashbord/Side";
import NavAdmin from "../../components/admin/dashbord/NavAdmin";
import Dashbox from "../../components/admin/dashbord/Dashbox";

const DashbordAdmin = () => {
  return (
    <div className="flex">
      
      {/* Left Sidebar */}
      <div className="w-[300px] fixed left-0 top-0 h-screen">
        <Side />
      </div>

      {/* Right Content */}
      <div className="ml-[300px] w-full">
        <NavAdmin />
        <Dashbox/>
       
      </div>
    </div>
  );
};

export default DashbordAdmin;
