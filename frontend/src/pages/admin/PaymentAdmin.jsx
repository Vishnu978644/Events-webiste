import React from 'react'
import Side from '../../components/admin/dashbord/Side'
import PaymentHome from '../../components/admin/payment/PaymentHome'

const PaymentAdmin = () => {
  return (
    <div className="flex">

      <div className="w-[300px] fixed left-0 top-0 h-screen bg-white shadow">
        <Side/>
      </div>

      <div className="ml-[300px] w-full">
        <div className="p-6">
          <PaymentHome />
        </div>
      </div>

    </div>
  )
}

export default PaymentAdmin
