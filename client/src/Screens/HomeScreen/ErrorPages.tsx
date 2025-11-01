import "./Home.css";
import React from "react";

export const PageNotFound = () => {
    return (
        <div className="empty-page">
            <h3 className="empty-page-title">404: Such page is not found</h3>
        </div>
    );
};

export const PageInDevelopment = () => {
    return (
        <div className="empty-page">
            <h3 className="empty-page-title">Sorry, this page is still in development.</h3>
        </div>
    );
};
