import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Terminal, Cpu, Play, Download, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- TAB 1: INSTALLATION STEPS ---
const installSteps = [
  {
    id: 1,
    title: "Download Agent",
    desc: "Get the pre-configured Python Agent (EXE). This contains the AI model and connection scripts.",
    icon: Download,
    color: "bg-purple-600",
    customContent: (
      <div className="flex flex-col items-center justify-center h-full z-50 relative">
        {/* UPDATED: Direct Download Link */}
        <a 
          href="https://drive.google.com/uc?export=download&id=1X5001ThZaFdINJEsi9QNKE2cnVXXLDca"
          className="cursor-pointer"
        >
          <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-xl cursor-pointer">
            <Download size={24} /> Download Now
          </button>
        </a>
        <p className="mt-4 text-white/60 text-xs">Size: ~6 MB (Includes AI Model)</p>
      </div>
    )
  },
  {
    id: 2,
    title: "Extract & Install",
    desc: "Unzip the downloaded folder. You will find 'SentinelAgent.exe' inside.",
    icon: Terminal,
    color: "bg-gray-800",
    code: "Right Click -> Extract All..."
  },
  {
    id: 3,
    title: "Ignition",
    desc: "Double-click 'SentinelAgent.exe'. It will automatically connect to the Cloud and start sending data.",
    icon: Play,
    color: "bg-orange-500",
    code: "./SentinelAgent.exe"
  }
];

// --- TAB 2: OPERATOR GUIDE ---
const userGuideSteps = [
  {
    id: 1,
    title: "System Status",
    desc: "GREEN (Nominal) means the machine pattern matches the AI's training. RED (Anomaly) means unknown vibration patterns detected.",
    icon: Activity,
    color: "bg-green-500",
    imagePlaceholder: "🟢 Nominal vs 🔴 Anomaly"
  },
  {
    id: 2,
    title: "Reading Telemetry",
    desc: "Sudden spikes in Vibration > 0.7G usually trigger the AI warning. Monitor the live chart for trends.",
    icon: AlertTriangle,
    color: "bg-red-500",
    imagePlaceholder: "📈 Chart Explanation"
  },
  {
    id: 3,
    title: "Safety Protocol",
    desc: "If an anomaly persists for >10 seconds, stop the machine and inspect mounting points.",
    icon: CheckCircle,
    color: "bg-blue-600",
    imagePlaceholder: "⚠️ Safety Procedures"
  }
];

const Manual = () => {
  const [activeTab, setActiveTab] = useState('install'); 
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const steps = activeTab === 'install' ? installSteps : userGuideSteps;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(curr => curr + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleTabChange = (tab) => {
      setActiveTab(tab);
      setCurrentStep(0);
      setDirection(0);
  }

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 max-w-5xl mx-auto pt-10">
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Documentation</h1>
        <p className="text-gray-500">Select a guide to begin</p>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-full mb-10">
          <button 
            onClick={() => handleTabChange('install')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'install' ? 'bg-white shadow-md text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Installation Setup
          </button>
          <button 
            onClick={() => handleTabChange('user')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'user' ? 'bg-white shadow-md text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Operator Guide
          </button>
      </div>

      <div className="relative w-full max-w-4xl h-[420px] bg-white/90 backdrop-blur-xl border border-black/5 rounded-3xl shadow-2xl overflow-hidden flex">
        
        <AnimatePresence mode='wait' custom={direction}>
          <motion.div
            key={`${activeTab}-${currentStep}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-full flex flex-col md:flex-row"
          >
            {/* VISUALS SIDE */}
            <div className={`w-full md:w-1/2 h-48 md:h-full ${steps[currentStep].color} flex items-center justify-center p-8 relative overflow-hidden`}>
               <div className="absolute inset-0 bg-black/10"></div>
               
               {/* Logic to choose what to display: Custom Button, Code, or Image */}
               {steps[currentStep].customContent ? (
                  steps[currentStep].customContent
               ) : steps[currentStep].code ? (
                 <div className="bg-gray-900 text-green-400 font-mono p-5 rounded-xl shadow-xl w-full text-xs leading-relaxed z-10">
                   <div className="flex gap-1.5 mb-3 border-b border-gray-700 pb-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                   </div>
                   <pre>{steps[currentStep].code}</pre>
                 </div>
               ) : (
                 <div className="bg-white/20 backdrop-blur border border-white/30 w-full h-48 rounded-2xl flex flex-col items-center justify-center shadow-lg z-10 text-white">
                    <CurrentIcon size={40} className="mb-2 opacity-80" />
                    <span className="text-xs font-bold uppercase tracking-widest">{steps[currentStep].imagePlaceholder}</span>
                 </div>
               )}
            </div>

            {/* TEXT SIDE */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 ${steps[currentStep].color} bg-opacity-20 rounded-lg text-white`}>
                    <CurrentIcon size={20} className="text-black" />
                  </div>
                  <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Step {currentStep + 1}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-3">{steps[currentStep].title}</h2>
              <p className="text-gray-500 leading-relaxed text-md mb-8">
                {steps[currentStep].desc}
              </p>

              {currentStep === steps.length - 1 && activeTab === 'user' && (
                <Link to="/dashboard">
                  <button className="bg-black text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 text-sm">
                    Launch Console <Activity size={16} />
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CONTROLS */}
        <div className="absolute bottom-6 right-6 flex gap-2">
          <button 
            onClick={prevStep} 
            disabled={currentStep === 0}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextStep} 
            disabled={currentStep === steps.length - 1}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Manual;