import "./Home.css";
import React from "react";
import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
import Header from "../Header";
import ProfilePage from '../Profile/ProfilePage'
import StatisticsPage from '../StatsScreen/StatsPage'
import Footer from "../Footer";
import FoodLogPage from "../FoodLog/FoodLogPage";
import {PageInDevelopment, PageNotFound} from "./ErrorPages"

const Home = (props: {myUserId: number, setMyUserId: React.Dispatch<React.SetStateAction<number>>}) => {
    const location = useLocation();

    return (
        <div className="home-page">
            <Header setUserId={props.setMyUserId}/>
            <Routes>
              <Route path="/" element={<Navigate to="/stats" replace />} />
              <Route path="/stats" element={<StatisticsPage />} />
              <Route path="/foodlog/*" element={<FoodLogPage />} />
              <Route path="/recipes" element={<PageInDevelopment />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<Navigate to={new URLSearchParams(location.search).get('redirect') || "/"}/>} />
              <Route path="/signup" element={<Navigate to="/"/>} />
              <Route path="/verify/*" element={<Navigate to="/"/>} />
              <Route path="*" element={<PageNotFound/>} />
            </Routes>
            <Footer />
        </div>
    );
};

export default Home;