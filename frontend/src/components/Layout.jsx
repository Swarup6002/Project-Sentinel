import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ParticleNetwork from './ParticleNetwork';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { User } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="relative min-h-screen text-slate-900 font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <ParticleNetwork />

      <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center bg-white/0 backdrop-blur-sm">
        <Link to="/" className="text-2xl font-bold tracking-tighter mix-blend-difference z-50">
          Sentinel<span className="opacity-30">.ai</span>
        </Link>
        
        <div className="flex gap-8 text-sm font-medium items-center z-50">
          
          {/* --- ANIMATED NAV LINKS --- */}
          <div className="flex gap-6 relative">
            <NavLink to="/" currentPath={location.pathname}>
              Home
            </NavLink>
            
           

           
            
            {session && (
              <NavLink to="/dashboard" currentPath={location.pathname}>
                Dashboard
              </NavLink>
            )}

              {/* NEW: Developer Link */}
            <NavLink to="/developer" currentPath={location.pathname}>
              Developer
            </NavLink>
          </div>
          {/* ------------------------- */}

          {session ? (
            <Link to="/profile">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-black/20">
                    <User size={18} />
                </div>
            </Link>
          ) : (
            <Link to="/auth">
                <button className="bg-black text-white px-5 py-2 rounded-full hover:scale-105 transition-transform">
                Sign In
                </button>
            </Link>
          )}
        </div>
      </nav>

      <main className="relative z-10 pt-24">
         <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
         >
           {children}
         </motion.div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENT FOR THE MAGIC UNDERLINE ---
const NavLink = ({ to, children, currentPath }) => {
  const isActive = currentPath === to;

  return (
    <Link to={to} className="relative px-1 py-1 group">
      <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}>
        {children}
      </span>
      
      {/* The Magic Underline */}
      {isActive && (
        <motion.div
          layoutId="navbar-underline"
          className="absolute left-0 right-0 bottom-0 h-[2px] bg-black"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
};

export default Layout;