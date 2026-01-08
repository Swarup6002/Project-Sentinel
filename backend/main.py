import time
import random
import numpy as np
import tensorflow as tf
import joblib
import serial
import threading
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# ================= SECURE CONFIGURATION =================
# 1. Load the secrets from the .env file
load_dotenv()

# 2. Get keys securely (Returns None if not found)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# 3. Validation Check
if not SUPABASE_URL or not SUPABASE_KEY:
    print(" [CRITICAL ERROR] Supabase Keys missing! Make sure .env file exists.")
    # Stop the script if keys are missing to prevent errors later
    exit()

# SENSOR CONFIG
SERIAL_PORT = 'COM3' 
BAUD_RATE = 9600
USE_SIMULATION = True 

# ================= INITIALIZATION =================
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
model = None
scaler = None
data_buffer = []
TIMESTEPS = 10

# Load AI
try:
    if os.path.exists('iot_sensor_model.h5'):
        model = tf.keras.models.load_model('iot_sensor_model.h5')
        scaler = joblib.load('iot_sensor_scaler.pkl')
        print(" [System] AI Brain Loaded.")
    else:
        print(" [Warning] Model files not found in folder.")
except Exception as e:
    print(f" [Warning] Error loading AI: {e}")

# ================= WORKER LOOP =================
def run_agent():
    global data_buffer
    print(" [Agent] Starting Telemetry Stream to Cloud...")
    
    ser = None
    if not USE_SIMULATION:
        try:
            ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
            print(f" [Hardware] Connected to {SERIAL_PORT}")
        except:
            print(" [Error] Connection failed. Switching to Simulation.")

    while True:
        # 1. READ DATA
        temp = 0.0
        vib = 0.0
        
        # Hardware vs Simulation Switch
        if ser and ser.isOpen():
            try:
                line = ser.readline().decode('utf-8').strip()
                parts = line.split(',')
                if len(parts) == 2:
                    temp = float(parts[0])
                    vib = float(parts[1])
            except:
                pass
        else:
            # Simulation Data Generator
            is_spike = random.random() > 0.95
            temp = 45.0 + random.normalvariate(0, 2) + (20 if is_spike else 0)
            vib = 0.2 + random.normalvariate(0, 0.05) + (0.5 if is_spike else 0)

        # 2. AI PROCESSING
        data_buffer.append([temp, vib])
        if len(data_buffer) > TIMESTEPS:
            data_buffer.pop(0)

        is_anomaly = False
        score = 0.0

        if model and scaler and len(data_buffer) == TIMESTEPS:
            try:
                input_data = np.array(data_buffer)
                scaled = scaler.transform(input_data)
                reshaped = scaled.reshape(1, TIMESTEPS, 2)
                
                reconstruction = model.predict(reshaped, verbose=0)
                loss = np.mean(np.abs(reconstruction - reshaped))
                score = float(loss)
                is_anomaly = score > 0.15
            except Exception as e:
                print(f"AI Error: {e}")

        # 3. PUSH TO CLOUD
        try:
            data = {
                "temperature": round(temp, 2),
                "vibration": round(vib, 2),
                "is_anomaly": is_anomaly,
                "anomaly_score": round(score, 4)
            }
            supabase.table("telemetry").insert(data).execute()
            status = "🔴 ANOMALY" if is_anomaly else "🟢 NOMINAL"
            print(f" [Sent] T:{temp:.1f} V:{vib:.2f} | {status}")
        except Exception as e:
            print(f" [Upload Error] {e}")

        time.sleep(2.0) 

if __name__ == "__main__":
    run_agent()