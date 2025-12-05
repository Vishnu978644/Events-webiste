import React from 'react'

const Hero = () => {
  return (
    <div>
      <img src="./event planning.jpg" alt=""
        className='w-full h-[600px] object-cover mt-[60px] border-4'
      />
      {/* Stats Grid: 3 Cards */}
<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center text-white text-center bg-rose-500 mt-6 h-[100px] rounded-2xl mx-auto w-[90%]'>

  {/* Stat 1: Happy Customers */}
  <div className='flex flex-col items-center border-r sm:border-r-2 border-rose-300/50 last:border-r-0 pt-4 px-2'>
    <h1 className='text-3xl font-extrabold'>
      2000<span className='opacity-70 text-2xl'>+</span>
    </h1>
    <p className='mt-1 text-rose-50 text-sm font-medium uppercase tracking-wider'>
      Happy Customers
    </p>
  </div>

  {/* Stat 2: Weddings */}
  <div className='flex flex-col items-center border-r sm:border-r-2 border-rose-300/50 last:border-r-0 pt-4 px-2'>
    <h1 className='text-3xl font-extrabold'>
      300<span className='opacity-70 text-2xl'>+</span>
    </h1>
    <p className='mt-1 text-rose-50 text-sm font-medium uppercase tracking-wider'>
      Weddings
    </p>
  </div>

  {/* Stat 3: Events */}
  <div className='flex flex-col items-center pt-4 px-2'>
    <h1 className='text-3xl font-extrabold'>
      1000<span className='opacity-70 text-2xl'>+</span>
    </h1>
    <p className='mt-1 text-rose-50 text-sm font-medium uppercase tracking-wider'>
      Events
    </p>
  </div>

</div>

    </div>
      
   
  )
}

export default Hero