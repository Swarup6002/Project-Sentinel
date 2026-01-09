import React, { useState, useEffect, useRef, memo } from 'react';
import { Activity, Thermometer, AlertTriangle, CheckCircle, WifiOff, Server } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

const Card = memo(({ children, className = '' }) => (
  <div className={`bg-white/80 backdrop-blur-sm border border-black/5 p-6 rounded-2xl shadow-sm ${className}`}>
    {children}
  </div>
));

const Dashboard = () => {
  const [status, setStatus] = useState('offline'); // Default to offline
  const [sensorData, setSensorData] = useState([]);
  const [reading, setReading] = useState({ temp: 0, vib: 0 });
  const [lastSeen, setLastSeen] = useState(null);
  
  // Ref to track the watchdog timer so we can reset it
  const watchdogRef = useRef(null);

  // --- HELPER: RESET WATCHDOG ---
  const resetWatchdog = () => {
    if (watchdogRef.current) clearTimeout(watchdogRef.current);
    
    // Set a new timer: If no data comes in 5 seconds, mark as OFFLINE
    watchdogRef.current = setTimeout(() => {
      setStatus('offline');
    }, 5000); // 5 Seconds Timeout
  };

  useEffect(() => {
    // 1. Initial Fetch (Get last 20 readings)
    const fetchHistory = async () => {
      const { data } = await supabase
        .from('telemetry')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data && data.length > 0) {
        // Reverse so graph goes left-to-right
        const formatted = data.reverse().map(d => ({
            time: new Date(d.created_at).toLocaleTimeString(),
            temp: d.temperature,
            vib: d.vibration
        }));
        setSensorData(formatted);

        // Check how old the last data point is
        const lastTime = new Date(data[data.length - 1].created_at).getTime();
        const now = new Date().getTime();
        
        // If data is recent (< 5 sec), set status active. Otherwise offline.
        if (now - lastTime < 5000) {
            setReading({
                temp: data[data.length - 1].temperature.toFixed(1),
                vib: data[data.length - 1].vibration.toFixed(2)
            });
            setStatus(data[data.length - 1].is_anomaly ? 'anomaly' : 'nominal');
            resetWatchdog();
        } else {
            setStatus('offline');
        }
      }
    };

    fetchHistory();

    // 2. Realtime Subscription (Listen for NEW data)
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'telemetry',
        },
        (payload) => {
          const newData = payload.new;
          
          // Data Received -> System is ONLINE
          resetWatchdog();
          
          setReading({ 
              temp: newData.temperature.toFixed(1), 
              vib: newData.vibration.toFixed(2) 
          });

          setStatus(newData.is_anomaly ? 'anomaly' : 'nominal');

          setSensorData(prev => {
            const updated = [...prev, {
                time: new Date(newData.created_at).toLocaleTimeString(),
                temp: newData.temperature,
                vib: newData.vibration
            }];
            if (updated.length > 20) updated.shift();
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
    };
  }, []);

  // --- DYNAMIC STYLES BASED ON STATUS ---
  const getStatusColor = () => {
      switch(status) {
          case 'nominal': return 'bg-green-500';
          case 'anomaly': return 'bg-red-500';
          default: return 'bg-gray-400';
      }
  };

  const getStatusText = () => {
    switch(status) {
        case 'nominal': return 'text-green-600';
        case 'anomaly': return 'text-red-600';
        default: return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20 pt-10">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-end mb-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">Cloud Console</h1>
          <p className="text-gray-500">Live IoT stream via Supabase Realtime</p>
        </motion.div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
           <span className="text-sm font-mono text-gray-400 uppercase tracking-widest">System Status</span>
           <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-black/5 shadow-sm">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${status !== 'offline' ? 'animate-pulse' : ''}`}></div>
              <span className={`font-bold uppercase text-sm ${getStatusText()}`}>
                {status === 'offline' ? 'DISCONNECTED' : status}
              </span>
           </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* 1. AI STATUS CARD */}
        <Card className={`md:col-span-1 flex flex-col justify-center transition-colors duration-500 ${status === 'anomaly' ? 'bg-red-600 text-white border-none' : ''}`}>
           <div className="flex items-center gap-4">
              {status === 'offline' ? (
                  <WifiOff size={32} className="text-gray-400" />
              ) : status === 'nominal' ? (
                  <CheckCircle size={32} />
              ) : (
                  <AlertTriangle size={32} />
              )}
              
              <div>
                 <div className={`text-xs uppercase tracking-widest mb-1 ${status === 'anomaly' ? 'opacity-80' : 'text-gray-400'}`}>
                     AI Confidence
                 </div>
                 <div className="text-2xl font-bold leading-tight">
                    {status === 'offline' 
                        ? 'System Offline' 
                        : status === 'nominal' 
                            ? '99.8% Secure' 
                            : 'ANOMALY DETECTED'}
                 </div>
                 {status === 'offline' && <div className="text-xs text-gray-400 mt-1">Waiting for agent...</div>}
              </div>
           </div>
        </Card>

        {/* 2. TEMPERATURE CARD */}
        <Card>
          <div className="flex justify-between items-center mb-4">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Temperature</span>
             <Thermometer size={20} className="text-gray-400" />
          </div>
          <div className={`text-5xl font-light tracking-tighter ${status === 'offline' ? 'opacity-30' : ''}`}>
            {status === 'offline' ? '--' : reading.temp}<span className="text-lg text-gray-400 ml-1">°C</span>
          </div>
        </Card>

        {/* 3. VIBRATION CARD */}
        <Card>
          <div className="flex justify-between items-center mb-4">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vibration</span>
             <Activity size={20} className="text-gray-400" />
          </div>
          <div className={`text-5xl font-light tracking-tighter ${status === 'offline' ? 'opacity-30' : ''}`}>
            {status === 'offline' ? '--' : reading.vib}<span className="text-lg text-gray-400 ml-1">G</span>
          </div>
        </Card>
      </div>

      {/* CHART SECTION */}
      <Card className="h-[400px] w-full relative">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Sensor Fusion Stream</h3>
            <div className="flex gap-4 text-xs font-medium">
                <span className="flex items-center gap-2 text-gray-500"><div className="w-2 h-2 rounded-full bg-black"></div> Temp</span>
                <span className="flex items-center gap-2 text-gray-500"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Vib</span>
            </div>
        </div>
        
        {/* OVERLAY WHEN OFFLINE */}
        {status === 'offline' && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-gray-400">
                <Server size={48} className="mb-4 opacity-50" />
                <p className="font-mono text-sm uppercase tracking-widest">Connection Lost</p>
                <p className="text-xs mt-2">Please run SentinelAgent.exe</p>
            </div>
        )}

        <div className="w-full h-[85%]">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sensorData}>
                <XAxis dataKey="time" hide={true} />
                <YAxis domain={['auto', 'auto']} hide={true} />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#000' }}
                    animationDuration={100} 
                />
                <Line 
                    isAnimationActive={false}
                    type="monotone" 
                    dataKey="temp" 
                    stroke="#000" 
                    strokeWidth={2} 
                    dot={false} 
                />
                <Line 
                    isAnimationActive={false}
                    type="monotone" 
                    dataKey="vib" 
                    stroke="#d1d5db" 
                    strokeWidth={2} 
                    dot={false} 
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;