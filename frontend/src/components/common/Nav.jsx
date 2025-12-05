import React from 'react'
import { navSection } from '../../utils/Constant.js'
import { Link, useNavigate } from 'react-router-dom'

const Nav = () => {
  const navigate = useNavigate()
  const handleExit = () => {
    navigate('/login')
  }

  const navItems = [
    { name: navSection?.name1, link: navSection.link.mith },
    { name: navSection?.name2, link: navSection.link.vith },
    { name: navSection?.name3, link: navSection.link.smith },
    { name: navSection?.name4, link: navSection.link.math },
    { name: navSection?.name6, link: navSection.link.xith },
    { name: navSection?.name5, link: navSection.link.path },
 
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-20 bg-rose-200 border-b border-white-400 shadow-2xl shadow-rose-300 ">
      <div className="max-w-screen-2xl xl:max-w-[1550px] h-[60px] mx-auto flex justify-between items-center px-6 py-4 ml-10 mr-20">

        <div className="flex items-center space-x-4">
          <img
            src="./logo.jpg"
            alt="Logo"
            className="w-[100px] h-12 object-cover rounded-full"
          />
        </div>

        <div className="flex items-center space-x-12 font-music font-bold  text-black">

          {navItems.map((item, index) => (
            <Link key={index} to={item.link}>
              <h1 className="text-xl xl:text-[15px] font-music hover:text-pink-500 transition duration-300">
                {item.name}
              </h1>
            </Link>
          ))}

         
          
        </div>

        <button className="relative inline-block overflow-hidden rounded-full px-4 py-2 text-[13px] font-bold 
                           text-white bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 
                           shadow-lg shadow-rose-400/50 hover:scale-105 hover:shadow-rose-500/70 
                           transition-all duration-300 whitespace-nowrap"
          onClick={handleExit}>
          <span className="relative z-10">Log Out</span>
          <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-pink-500 to-rose-600 opacity-0 
                           hover:opacity-100 transition-opacity duration-300"></span>
        </button>

      </div>
    </div>
  )
}

export default Nav