import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Manual from './pages/Manual';
import Developer from './pages/Developer'; // <--- NEW IMPORT

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/manual" element={<Manual />} />
          <Route path="/developer" element={<Developer />} /> {/* <--- NEW ROUTE */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;