import React from 'react'; 
import Side from '../../components/admin/dashbord/Side';
import FiltersAdmin from '../../components/admin/categories/FiltersAdmin';
import { Outlet, useLocation } from 'react-router-dom';
import CategoryHome from '../../components/admin/categories/CategoryHome';

const CategriesAdmin = () => {
  const location = useLocation();

  const isCategoryHome =
    location.pathname === "/admin/categories" ||
    location.pathname === "/admin/categories/";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-[300px] flex-shrink-0 fixed left-0 top-0 h-full bg-white shadow-xl z-10">
        <Side />
      </div>

      {/* Main Content */}
      <div className="flex-grow ml-[300px]">
        <div className="p-6">
          {/* Show Filters and CategoryHome only on main category page */}
          {isCategoryHome && <FiltersAdmin />}
          {isCategoryHome && (
            <div className="mt-8">
              <CategoryHome />
            </div>
          )}

          {/* Render nested route (AdminCategoryImage) only if NOT main category page */}
          {!isCategoryHome && <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default CategriesAdmin;
