import React from "react";
import Sidenav from "../../components/user/vendores/Sidenav";
import Hero3 from "../../components/user/bride/Hero3";
import Card2 from "../../components/user/bride/Card2";
import Dress from "../../components/user/bride/Dress";
import Jewels from "../../components/user/bride/Jewels";

const Bride = () => {
  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      {/* ===== Side Navigation (Always on Top) ===== */}
      <div className="fixed left-0 z-50">
        <Sidenav />
      </div>

      {/* ===== Page Content (Below Sidenav) ===== */}
      <div className="relative z-0 "> 
        {/* adjust padding-left to match sidenav width */}
        <Hero3 />
        <Card2 />
        <Dress />
        <Jewels />
      </div>
    </div>
  );
};

export default Bride;
