import React from 'react';
import Logo from "../asserts/logo.png";
import '../CSS/navbar.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import CollectionsIcon from '@mui/icons-material/Collections';
import PagesIcon from '@mui/icons-material/Pages';
import HomeIcon from "@mui/icons-material/Home";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Navbar = () => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === 'admin';
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      {/* Logo on the left */}
      <div className="container-fluid">
        <a className="navbar-brand" href="#" onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}>
          <img src={Logo} width="150" height="50" alt="RoadPets Logo" style={{ cursor: 'pointer' }} />
        </a>

        {/* Toggler button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation items aligned to the right */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link nav-link-large" href="/">
              <HomeIcon style={{ fontSize: '24px', verticalAlign: '-4px', marginRight: '5px' }} />
              Home</a>
            </li>
            
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <a className="nav-link nav-link-large" href="/create">
                  <PagesIcon style={{ fontSize: '24px', verticalAlign: '-4px', marginRight: '5px' }} />
                  New Post</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link nav-link-large" href="/petdashboard">
                    <PetsIcon style={{ fontSize: '24px', verticalAlign: '-4px', marginRight: '5px' }} />
                    My Pets
                  </a>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <a className="nav-link nav-link-large" href="/admin">
                      <AdminPanelSettingsIcon style={{ fontSize: '24px', verticalAlign: '-4px', marginRight: '5px' }} />
                      Admin Panel
                    </a>
                  </li>
                )}
              </>
            )}
            
            <li className="nav-item">
              <a className="nav-link nav-link-large" href="/gallery">
              <CollectionsIcon style={{ fontSize: '24px', verticalAlign: '-4px', marginRight: '5px' }} />
              Gallery</a>
            </li>
            
            {!isAuthenticated ? (
              <>
                <li className="nav-item px-2">
                  <a className="btn-signup" href="/signup">SignUp</a>
                  
                </li>
                <li className="nav-item px-2">
                  <a className="btn-signup" href="/login">Login</a>
                </li>
              </>
            ) : (
              <li className="nav-item px-2">
                <a href="/profile">
                  <AccountCircleIcon style={{ color: 'gray', fontSize: '50px', cursor: 'pointer' }} />
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
