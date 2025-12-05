import React from "react";
import Sidenav from "../../components/user/vendores/Sidenav";
import Card3 from "../../components/user/groom/Card3";
import Hero4 from "../../components/user/groom/Hero4";
import Dress1 from "../../components/user/groom/Dress1";
import Jewels1 from "../../components/user/groom/Jewels1";

const Grooms = () => {
  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      {/* ===== Fixed Top Navigation ===== */}
      <div className="fixed left-0 top-0 z-50 w-full">
        <Sidenav />
      </div>

      {/* ===== Page Content Below Sidenav ===== */}
      <div className="relative z-0 mt-[130px]"> 
        {/* adjust margin-top based on sidenav height */}
        <Hero4 />
        <Card3 />
        <Dress1 />
        <Jewels1 />
      </div>
    </div>
  );
};

export default Grooms;
