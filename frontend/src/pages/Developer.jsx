import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Terminal, BrainCircuit, Code2, Cpu, User } from 'lucide-react';
import { supabase } from '../supabaseClient';

// --- SMOOTH ANIMATION VARIANTS ---
// 1. The Container controls the timing (stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // 0.2s delay between each item appearing
      delayChildren: 0.1
    }
  }
};

// 2. The Items define the actual movement (slide up + fade in)
const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    // A custom cubic-bezier for a very premium, smooth feel
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }
  }
};

const Developer = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        let { data, error } = await supabase
          .from('developer_profile')
          .select('*')
          .limit(1)
          .single();

        if (error) {
            if (error.code !== 'PGRST116') setErrorMsg(error.message);
        } else {
            setProfile(data);
        }
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Loading State (Kept simple)
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
           className="w-10 h-10 border-4 border-black border-t-transparent rounded-full"
        />
        <p className="text-gray-500 font-mono animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  return (
    // WRAP EVERYTHING IN THE MOTION CONTAINER
    <motion.div 
      className="px-6 md:px-12 max-w-7xl mx-auto pb-32 pt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible" // Triggers the staggered animation on load
    >
      
      {/* ================= 1. PROJECT VISION SECTION ================= */}
      <section className="min-h-[40vh] flex flex-col justify-center items-start mb-24">
        
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-black/5 rounded-lg backdrop-blur-sm border border-black/5">
              <BrainCircuit className="w-5 h-5 text-black" />
          </div>
          <span className="text-xs font-bold uppercase text-gray-400 tracking-[0.2em]">Project Vision</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 max-w-5xl leading-[1.1]">
          Bridging the gap between <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-black">
            Silicon & Intelligence.
          </span>
        </motion.h1>
        
        {/* Description Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <p className="text-lg text-gray-600 leading-relaxed">
            Industrial machinery generates terabytes of data that often goes unheard. 
            Sentinel.ai was built to give that hardware a voice. By deploying LSTM Autoencoders 
            at the edge, we can detect the subtle vibrational fingerprints of failure 
            before catastrophic breakdown occurs.
          </p>
          {/* Tech Stack Icons */}
          <div className="flex flex-col gap-4 text-sm text-gray-400 font-medium">
              <div className="flex items-center gap-3">
                  <Cpu size={18} className="text-black" /> <span>Edge Computing Architecture</span>
              </div>
              <div className="flex items-center gap-3">
                  <Code2 size={18} className="text-black" /> <span>Real-time Python Inference</span>
              </div>
              <div className="flex items-center gap-3">
                  <BrainCircuit size={18} className="text-black" /> <span>Unsupervised Deep Learning</span>
              </div>
          </div>
        </motion.div>
      </section>

      {/* ================= 2. MEET THE DEVELOPER SECTION ================= */}
      <section>
        {/* Divider Title */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-12">
             <div className="h-[1px] bg-gray-200 flex-grow"></div>
             <span className="text-sm font-mono text-gray-400 uppercase tracking-widest">Architect</span>
             <div className="h-[1px] bg-gray-200 flex-grow"></div>
        </motion.div>

        {errorMsg && (
            <motion.div variants={itemVariants} className="p-4 mb-8 bg-red-50 text-red-600 border border-red-200 rounded-lg text-center">
                Error Loading Data: {errorMsg}
            </motion.div>
        )}

        <div className="flex flex-col md:flex-row gap-12 items-start justify-center">
            
            {/* ---- LEFT: IMAGE CARD (Has its own hover animation) ---- */}
            <motion.div
              variants={itemVariants} // Enters smoothly
              className="w-full max-w-sm bg-white/50 backdrop-blur-xl border border-black/5 p-4 rounded-[2rem] shadow-xl group cursor-pointer z-10"
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }} // Smooth hover
            >
                <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden relative bg-gray-100 flex items-center justify-center">
                    {profile?.avatar_url ? (
                        <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    ) : (
                        <User size={64} className="text-gray-300" />
                    )}
                </div>
                <div className="mt-6 mb-2 px-2 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/5 text-xs font-bold uppercase tracking-wider text-gray-500">
                        status: online
                    </div>
                </div>
            </motion.div>

            {/* ---- RIGHT: DETAILS (Staggered entrance) ---- */}
            <motion.div variants={itemVariants} className="w-full max-w-xl pt-4">
              {profile ? (
                <>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-slate-900">
                    {profile.full_name}
                  </h2>
                  <h3 className="text-xl text-gray-500 font-medium mb-8">
                    {profile.role}
                  </h3>

                  {profile.bio && (
                    <p className="text-lg text-slate-700 leading-relaxed mb-8">
                      {profile.bio}
                    </p>
                  )}

                  <blockquote className="relative p-6 pl-8 text-xl italic border-l-2 border-black bg-gray-50 rounded-r-xl mb-10">
                    <p className="mb-0 text-gray-800 font-serif leading-relaxed">
                      {profile.quotation || "Building the future..."}
                    </p>
                  </blockquote>

                  <div className="flex gap-4">
                    {profile.github_url && (
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                        <motion.button
                          whileHover={{ scale: 1.05, backgroundColor: "#000" }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-black text-white rounded-xl shadow-lg hover:bg-gray-800 flex items-center gap-3 text-sm font-bold transition-colors"
                        >
                          <Github size={20} /> GitHub
                        </motion.button>
                      </a>
                    )}
                    
                    {profile.linkedin_url && (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <motion.button
                          whileHover={{ scale: 1.05, backgroundColor: "#006097" }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-[#0077b5] text-white rounded-xl shadow-lg hover:bg-[#006097] flex items-center gap-3 text-sm font-bold transition-colors"
                        >
                          <Linkedin size={20} /> LinkedIn
                        </motion.button>
                      </a>
                    )}
                  </div>
                </>
              ) : (
                // FALLBACK
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                    <h3 className="text-xl font-bold mb-2">Profile data not found</h3>
                    <p className="text-gray-500">Ensure Supabase table is populated.</p>
                </div>
              )}
            </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Developer;