import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User, Save, LogOut } from 'lucide-react';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [website, setWebsite] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/auth'); // Redirect if not logged in
        return;
      }

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, full_name`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username || '');
        setFullName(data.full_name || '');
        setWebsite(data.website || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      const updates = {
        id: user.id,
        username,
        full_name: fullName,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
      alert('Profile updated!');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] pt-10 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur border border-black/5 p-8 rounded-3xl shadow-xl">
        
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Your Profile</h2>
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                <User size={24} />
            </div>
        </div>

        {loading ? (
            <p className="text-center text-gray-500">Loading profile...</p>
        ) : (
            <form onSubmit={updateProfile} className="flex flex-col gap-4">
            
            <div>
                <label className="text-xs font-bold uppercase text-gray-400">Email</label>
                <input 
                    className="w-full bg-gray-100 border border-gray-200 p-3 rounded-xl text-gray-500 cursor-not-allowed" 
                    type="text" 
                    value="Managed by Supabase" 
                    disabled 
                />
            </div>

            <div>
                <label className="text-xs font-bold uppercase text-gray-400">Full Name</label>
                <input
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </div>

            <div>
                <label className="text-xs font-bold uppercase text-gray-400">Username</label>
                <input
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <button 
                className="w-full bg-black text-white p-4 rounded-xl font-bold mt-4 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                disabled={loading}
            >
                <Save size={18} /> {loading ? 'Saving...' : 'Update Profile'}
            </button>

            <button 
                type="button"
                onClick={handleSignOut}
                className="w-full bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl font-bold mt-2 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
            >
                <LogOut size={18} /> Sign Out
            </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default Profile;