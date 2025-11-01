import "./Home.css";
import React from "react";
import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
import Header from "../Header";
import Footer from "../Footer";

const Home = (props: {myUserId: number, setMyUserId: React.Dispatch<React.SetStateAction<number>>}) => {
    const location = useLocation();

    return (
        <div className="home-page">
            <Header setUserId={props.setMyUserId}/>
            <Routes>
              <Route path="/" element={<Navigate to="/stats" replace />} />
              <Route path="/stats" element={<PageInDevelopment />} />
              <Route path="/foodlog" element={<PageInDevelopment />} />
              <Route path="/recipes" element={<PageInDevelopment />} />
              <Route path="/profile" element={<PageInDevelopment />} />
              <Route path="/login" element={<Navigate to={new URLSearchParams(location.search).get('redirect') || "/"}/>} />
              <Route path="/signup" element={<Navigate to="/"/>} />
              <Route path="/verify/*" element={<Navigate to="/"/>} />
              <Route path="*" element={<PageNotFound/>} />
            </Routes>
            <Footer />
        </div>
    );
};

const PageNotFound = () => {
    return (
        <div className="empty-page">
            <h3 className="empty-page-title">404: Such page is not found</h3>
        </div>
    );
};

const PageInDevelopment = () => {
    return (
        <div className="empty-page">
            <h3 className="empty-page-title">Sorry, this page is still in development.</h3>
        </div>
    );
};

export default Home;