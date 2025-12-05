import React from 'react'
import Side from '../../components/admin/dashbord/Side'
import Artist from '../../components/admin/artist/Artist'

const AdminArtist = () => {
  return (
    <div className="flex">

      {/* Sidebar */}
      <div className="w-[300px] fixed left-0 top-0 h-screen bg-white shadow">
        <Side/>
      </div>

      {/* Main Section */}
      <div className="ml-[300px] w-full">
      

        <div className="p-6">

         <Artist/>

         

        </div>
      </div>

    </div>
  )
}

export default AdminArtist