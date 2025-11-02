import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faUtensils, faBookOpen, faUser, faLeaf } from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
      { id: 'stats', label: 'Statistics', path: '/stats', icon: faChartSimple },
      { id: 'foodlog', label: 'Food Log', path: '/foodlog', icon: faUtensils },
      { id: 'ingredients', label: 'Ingredients', path: '/ingredients', icon: faLeaf },
      { id: 'recipes', label: 'Recipes', path: '/recipes', icon: faBookOpen },
      { id: 'profile', label: 'Profile', path: '/profile', icon: faUser },
    ];

  return (
    <nav className="bottom-nav">
      {navItems.map(item => {
        const isActive = location.pathname.startsWith(item.path);
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={item.icon} size="lg" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
