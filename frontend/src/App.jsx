import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/common/Nav.jsx';
import Footer from './components/common/Footer.jsx';

// Import the PaymentProvider
import { PaymentProvider } from './context/PaymentContext.jsx';

// User Pages
import Home from './pages/user/Home.jsx';
import Contact from './pages/user/Contact.jsx';
import Planning from './pages/user/Planning.jsx';
import Vendores from './pages/user/Vendores.jsx';
import Bride from './pages/user/Bride.jsx';
import Grooms from './pages/user/Grooms.jsx';
import Vengue from './pages/user/Vengue.jsx';
import Categries from './pages/user/Categries.jsx';
import BookingPage from './pages/user/BookingPage.jsx';

// Auth Pages
import Signin from './pages/auth/Signin.jsx';
import Login from './pages/auth/Login.jsx';
import Forget from './pages/auth/Forget.jsx';

// Admin Pages
import DashbordAdmin from './pages/admin/DashbordAdmin.jsx';
import CategriesAdmin from './pages/admin/CategriesAdmin.jsx';
import AdminHeroslide from './components/admin/categories/AdminHeroslide.jsx';
import AdminCateGallery from './components/admin/categories/AdminCateGallery.jsx';
import AdminClientSay from './components/admin/categories/AdminClientSay.jsx';
import AdminBirthGallery from './components/admin/categories/AdminBirthGallery.jsx';
import AdminRecentImage from './components/admin/categories/AdminRecentImage.jsx';
import AdminCorpGallery from './components/admin/categories/AdminCorpGallery.jsx';
import VendoresAdmin from './pages/admin/VendoresAdmin.jsx';
import AdminMakeup from './components/admin/vendores/AdminMakeup.jsx';
import AdminPhoto from './components/admin/vendores/AdminPhoto.jsx';
import AdminVengue from './components/admin/vendores/AdminVengue.jsx';
import BriGroomAdmin from './pages/admin/BriGroomAdmin.jsx';
import BrideDressAdmin from './components/admin/bridesgroom/BrideDressAdmin.jsx';
import GroomDressAdmin from './components/admin/bridesgroom/GroomDressAdmin.jsx';
import BrideJewelAdmin from './components/admin/bridesgroom/BrideJewelAdmin.jsx';
import GroomJewelAdmin from './components/admin/bridesgroom/GroomJewelAdmin.jsx';
import WeddingAdmin from './pages/admin/WeddingAdmin.jsx';
import WeHeroSlide from './components/admin/wedding/WeHeroSlide.jsx';
import WedHallAdmin from './components/admin/wedding/WedHallAdmin.jsx';
import WedDecorationAdmin from './components/admin/wedding/WedDecorationAdmin.jsx';
import WedTransportAdmin from './components/admin/wedding/WedTransportAdmin.jsx';
import PlanningAdmin from './pages/admin/PlanningAdmin.jsx';
import PlanDestination from './components/admin/planning/PlanDestination.jsx';
import ContactAdmin from './pages/admin/ContactAdmin.jsx';
import AdminCategoryImage from './components/admin/categories/AdminCategoryImage.jsx';
import AdminWedFlora from './components/admin/categories/AdminWedFlora.jsx';
import AdminCateGalleryImage from './components/admin/categories/AdminCateGalleryImage.jsx';
import VendoreNavingHome from './components/admin/vendores/VendoreNavingHome.jsx';
import PlanningService from './components/admin/planning/PlanningService.jsx';
import PaymentAdmin from './pages/admin/PaymentAdmin.jsx';
import BrideMakeup from './components/admin/bridesgroom/BrideMakeup.jsx';
import GroomsMakeup from './components/admin/bridesgroom/GroomsMakeup.jsx';
import AdminArtist from './pages/admin/AdminArtist.jsx';


const AppContent = () => {
    // Removed unused const [paymentData, setPaymentData] = useState([]);
    const location = useLocation();

    // Hide Navbar/Footer on these routes
    const hideLayout = ['/', '/login', '/password'].includes(location.pathname) || location.pathname.startsWith('/admin');

    return (
        <>
            <div>
                {!hideLayout && <Nav />}

                <Routes>
                    {/* --- User/Auth Routes --- */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/plan" element={<Planning />} />
                    <Route path="/vent" element={<Vendores />} />
                    <Route path="/vent/bride" element={<Bride />} />
                    <Route path="/vent/grooms" element={<Grooms />} />
                    <Route path="/vent/vengue" element={<Vengue />} />
                    <Route path="/booking" element={<BookingPage />} />
                    <Route path="/categries" element={<Categries />} />
                    <Route path="/" element={<Signin />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/password" element={<Forget />} />

                    {/* --- Admin Routes (All combined into one Routes block) --- */}
                    <Route path='/admin/dashbord' element={<DashbordAdmin />} />
                    
                    <Route path='/admin/categories' element={<CategriesAdmin />} >
                        <Route path='heroslide' element={<AdminHeroslide />} />
                        <Route path='wedgallery' element={<AdminCateGallery />} />
                        <Route path='cateImage' element={<AdminCategoryImage />} />
                        <Route path='catgallimage' element={<AdminCateGalleryImage />} />
                        <Route path='clientsay' element={<AdminClientSay />} />
                        <Route path='birthgallery' element={<AdminBirthGallery />} />
                        <Route path='recentimages' element={<AdminRecentImage />} />
                        <Route path='wedflora' element={<AdminWedFlora />} />
                        <Route path='corparategallery' element={<AdminCorpGallery />} />
                    </Route>

                    <Route path='/admin/vendore' element={<VendoresAdmin />}>
                        <Route path='makeupposter' element={<AdminMakeup />} />
                        <Route path='photocards' element={<AdminPhoto />} />
                        <Route path='Venguecards' element={<AdminVengue />} />
                        <Route path='vendorenavi' element={<VendoreNavingHome />} />
                    </Route>
                    
                    <Route path='/admin/bridegroom' element={<BriGroomAdmin />}>
                        <Route path='bridemakeup' element={<BrideMakeup />} />
                        <Route path='groomsmakeup' element={<GroomsMakeup />} />
                        <Route path='bridedress' element={<BrideDressAdmin />} />
                        <Route path='groomdress' element={<GroomDressAdmin />} />
                        <Route path='bridejewels' element={<BrideJewelAdmin />} />
                        <Route path='groomjewels' element={<GroomJewelAdmin />} />
                    </Route>
                    
                    <Route path='/admin/wedding' element={<WeddingAdmin />}>
                        <Route path='wedhero' element={<WeHeroSlide />} />
                        <Route path='wedhall' element={<WedHallAdmin />} />
                        <Route path='decorationhalls' element={<WedDecorationAdmin />} />
                        <Route path='transport' element={<WedTransportAdmin />} />
                    </Route>
                    
                    <Route path='/admin/planning' element={<PlanningAdmin />}>
                        <Route path='destinationplan' element={<PlanDestination />} />
                        <Route path='serviceplan' element={<PlanningService />} />
                    </Route>
                    
                    <Route path='/admin/contact' element={<ContactAdmin />} />
                    <Route path='/admin/payment' element={<PaymentAdmin />} />
                    <Route path='/admin/artist' element={<AdminArtist />} />
                </Routes>

                {!hideLayout && <Footer />}
            </div>
        </>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            {/* Wrap the entire application content with the PaymentProvider */}
            <PaymentProvider>
                <AppContent />
            </PaymentProvider>
        </BrowserRouter>
    );
};

export default App;