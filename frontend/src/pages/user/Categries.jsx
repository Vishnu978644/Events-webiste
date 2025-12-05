import React from 'react'
import WeddingHero from '../../components/user/categries/WeddingHero.jsx'
import WeddingCards from '../../components/user/categries/WeddingCards.jsx'
import WeddingGallery from '../../components/user/categries/WeddingGallery.jsx'

import BirthdayReasons from '../../components/user/categries/BirthdayReasons.jsx'
import BirthdayGallery from '../../components/user/categries/BirthdayGallery.jsx'
import BirthdayMessage from '../../components/user/categries/BirthdayMessage.jsx'
import CorpHero from '../../components/user/categries/CorpHero.jsx'
import CorpGallery from '../../components/user/categries/CorpGallery.jsx'
import ReviewSection from '../../components/user/categries/ReviewSection.jsx'



const Categries = () => {
  return (
    <div>
      <WeddingHero/>
      <WeddingCards/>
      <WeddingGallery/>
     
      <BirthdayReasons/>
      <ReviewSection/>
      <BirthdayGallery/>
      <BirthdayMessage/>
      <CorpHero/>
      <CorpGallery/>
    
    </div>
  )
}

export default Categries