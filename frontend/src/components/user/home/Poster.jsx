import React, { useEffect, useState } from 'react'
import { banners } from '../../../utils/Constant';

const Poster = () => {
    // State to hold the index of the banner to display
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Only run this once on mount to pick a random index
        if (banners.length > 0) {
            const randomIndex = Math.floor(Math.random() * banners.length);
            setIndex(randomIndex);
        }
    }, []);

    return (
        // Container centered on wide screens (1730px) with a controlled max-width
        <div className='w-full max-w-screen-2xl mx-auto  px-4 mt-36'>
            
            {/* Inner div controls the height of the banner */}
            <div className='w-full h-[500px] md:h-[650px] xl:h-[400px] shadow-2xl'>
                <img 
                    // Ensures the image exists before trying to access the index
                    src={banners[index]} 
                    alt="Promotional Banner" 
                    // Image fills the container
                    className='w-full h-full object-cover rounded-3xl' 
                />
            </div>
        </div>
    )
}

export default Poster;