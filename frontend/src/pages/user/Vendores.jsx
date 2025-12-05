import React from "react";
import { Outlet } from "react-router-dom";
import Sidenav from "../../components/user/vendores/Sidenav";

import Hero2 from "../../components/user/vendores/Hero2";
import BrideVendore from "../../components/user/vendores/BrideVendore";
import GroomVendore from "../../components/user/vendores/GroomVendore";
import MakeupVendores from "../../components/user/vendores/MakeupVendores";
import PhotVendores from "../../components/user/vendores/PhotVendores";
import WedHall from "../../components/user/vendores/WedHall";


const Vendores = () => {
  return (
    <div >
      {/* Left Side - Sidebar */}
      

      {/* Right Side - Main Content */}
      <div >
       <Sidenav/>
        <Hero2/>
        <BrideVendore/>
        <GroomVendore/>
        <MakeupVendores/>
        <PhotVendores/>
        <WedHall/>
        <Outlet />
      </div>
    </div>
  );
};

export default Vendores;
