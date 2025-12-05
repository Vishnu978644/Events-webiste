import React from 'react'
import Sidenav from '../../components/user/vendores/Sidenav'
import Hero7 from '../../components/user/vengue/Hero7'
// import Connection from '../../components/user/vengue/Connection'
import Hallvengue from '../../components/user/vengue/Hallvengue'
import Decorationvendore from '../../components/user/vengue/Decorationvendore'
import Transvengue from '../../components/user/vengue/Transvengue'

const Vengue = () => {
  return (
    <div>
  <Sidenav/>
  <Hero7/>
  {/* <Connection/> */}
  <Hallvengue/>
  
  <Decorationvendore/>
  <Transvengue/>
    </div>
  )
}

export default Vengue