import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute ({ children }) {
    const { authenticated } = useContext(AuthContext);

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}