import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, Activity, ArrowRight, BookOpen } from 'lucide-react';

const transitionSettings = { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] };

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: transitionSettings
  }
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <motion.div 
    variants={fadeInUp}
    className="bg-white/80 backdrop-blur-md border border-black/5 p-8 rounded-2xl hover:shadow-xl transition-shadow will-change-transform"
  >
    <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-6">
      <Icon className="w-6 h-6 text-black" />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{desc}</p>
  </motion.div>
);

const Home = () => {
  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto pb-24 pt-10">
      
      {/* HERO SECTION */}
      <section className="min-h-[70vh] flex flex-col justify-center items-start">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={transitionSettings}
          className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 max-w-5xl will-change-transform"
        >
          Anomaly <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500">Detection.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transitionSettings, delay: 0.2 }}
          className="text-xl text-gray-500 max-w-xl mb-10 leading-relaxed"
        >
          Industrial-grade AI agent that monitors your hardware sensors in real-time. 
          Detect failures before they happen with LSTM neural networks.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionSettings, delay: 0.4 }}
          className="flex flex-wrap gap-4"
        >
          {/* 1. Launch Console Button */}
          <Link to="/dashboard">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium flex items-center gap-2 shadow-lg shadow-black/20"
            >
              Launch Console <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>

          {/* 2. NEW Manual Button (Replaces Create Account) */}
          <Link to="/manual">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }}
              whileTap={{ scale: 0.95 }}
              className="bg-white border border-black/10 text-black px-8 py-4 rounded-full text-lg font-medium flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> How to Use
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* FEATURES GRID */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }} 
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10"
      >
        <FeatureCard 
          icon={Cpu} 
          title="Edge Computing" 
          desc="Runs locally on your device or cloud. Optimized for low-latency sensor data streams via Serial/USB."
        />
        <FeatureCard 
          icon={ShieldCheck} 
          title="Unsupervised Learning" 
          desc="No need to label data. The LSTM Autoencoder learns 'normal' patterns and flags anything that deviates."
        />
        <FeatureCard 
          icon={Activity} 
          title="Real-time Visualization" 
          desc="Monitor vibration, temperature, and power consumption with high-fidelity charts and instant alerts."
        />
      </motion.section>

    </div>
  );
};

export default Home;