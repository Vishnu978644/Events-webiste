import React, { useRef, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
import { useLocation } from 'react-router-dom'

const NavAdmin = () => {
  const[selected,setSelected]=useState()
    const inputref=useRef()
    const handleClick=()=>{
       inputref.current.focus()
    }

    const location=useLocation();

      const pageTitles = {
    "/admin/dashbord": "Dashboard Home",
    "/admin/categories": "Manage Categories",
    "/admin/bride/groom": "Brides Grooms Manager",
   "/admin/categories/heroslide":"Hero Slides",
   "/admin/categories/wedgallery":"Wedding Gallery",
   "/admin/categories/wedflora":"Wedding Flora Images",
   "/admin/categories/clientsay":"Client Review",
   "/admin/categories/birthgallery":"Birthday Gallery",
   "/admin/categories/recentimages":"Recent Images",
   "/admin/categories/corparategallery":"Corparate Gallery",
   "/admin/vendore/photocards":"Photography Cards",
   "/admin/vendore":"Vendores Page",
   "/admin/vendore/Venguecards":"Vengue Cards",
    "/admin/Planning": "Planning Manager",
    "/admin/Wedding": "Wedding Manager",
    "/admin/Contact": "Contact Manager",
    "/admin/vendore/makeupposter":"Makeup Cards",
    "/admin/bridegroom":"Brides/Grooms",
    "/admin/bridegroom/bridedress":"Brides Dresses",
    "/admin/bridegroom/groomdress":"Grooms Dresses",
    "/admin/bridegroom/bridejewels":"Brides Jewels",
    "/admin/bridegroom/groomjewels":"Grooms Jewels",
    "/admin/wedding":"Wedding Halls",
    "/admin/wedding/wedhero":"Wedding Hero Slide",
    "/admin/wedding/wedhall":"Wedding Halls",
    "/admin/wedding/decorationhalls":"Wedding Hall Decorations",
    "/admin/wedding/transport":"Wedding Veichle Transport",
    "/admin/planning/destinationplan":"Wedding Plannings"
  };

  const currentTitle=pageTitles[location.pathname]||"Admin Panel"

  return (
    <div className='mt-0 flex justify-between mr-8'>
       
        
    </div>
  )
}

export default NavAdmin