import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [ authenticated, setAuthenticated ] = useState(false)

    useEffect(() => {
      console.log("AUTHENTICATION EFFECT - AuthContext")
      isAuthenticated().then( data => {
          console.log(data)
          setAuthenticated(data['authenticated'])
        }
      )
    }, [])
    
    const handleLogout = () => {
      logout();
      //setAuthenticated(null); // Setting state not required as redirection from API call refreshes the page anyway, thus making the is-authenticated call and hence having the right state
    };
  
    const value = {
      onLogout: handleLogout,
      authenticated
    };

    function isAuthenticated() {
      return new Promise((resolve, reject) => {
        fetch('api/is-authenticated', {
        // fetch('http://localhost:5000/api/is-authenticated', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then((response) => {
          resolve(response.json());
        })
      })
    }

    function logout() {
        fetch('api/logout', {
        // fetch('http://localhost:5000/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
      })
      .then((response) => {
        if (response.redirected) {
          window.location.href = response.url;
        }
      })
    }
  
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
};