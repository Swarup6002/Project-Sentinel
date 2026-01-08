import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard'); // Redirect on success
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the login link!');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white/90 backdrop-blur border border-black/5 p-10 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Join Sentinel'}</h2>
        <p className="text-gray-500 mb-8">Enter your credentials to access the neural network.</p>
        
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input
            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black transition-colors"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black transition-colors"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            disabled={loading}
            className="w-full bg-black text-white p-4 rounded-xl font-bold mt-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-black font-bold underline">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;