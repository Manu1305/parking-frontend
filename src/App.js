  import React from 'react';
  import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
  import { ThemeProvider, CssBaseline } from '@mui/material';
  import theme from './theme'; // Custom theme
  import Login from './components/login';
  import ParkingDashboard from './components/parkingDashboard';
  import Register from './components/Register';
  import BookingHistory from './components/BookingHistory';
  import WalletDashboard from './components/walletDashboard';

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); 
    console.log(children,'children',token,'token')
        return token ? children : <Navigate to="/login" />;
  };


  const DefaultRoute = () => {
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
  };

  const App = () => {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
           
            <Route path="/" element={<DefaultRoute />} />

          
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

   
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ParkingDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <WalletDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  };

  export default App;
