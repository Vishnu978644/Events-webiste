import React from "react";

import Intro from "../../components/user/home/Intro";
import Hero from "../../components/user/home/Hero";
import AboutCom from "../../components/user/home/AboutCom";
import Need from "../../components/user/home/Need";
import Poster from "../../components/user/home/Poster";
import Review from "../../components/user/home/Review";
import Card from "../../components/user/home/Card";





const Home = () => {
    return (
        <div>
            <Intro />
            <Hero/>
           <AboutCom/>
           <Need/>
           <Poster/>
           <Review/>
           <Card/>
        </div>
    );
};

export default Home;
