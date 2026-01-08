import sys
import os
import time
import random
import threading
import serial
import numpy as np
import tensorflow as tf
import joblib
from dotenv import load_dotenv
from supabase import create_client, Client

# --- 1. RESOURCE PATH SOLVER (The Magic Function) ---
# This fixes file paths when running inside the .exe
def resource_path(relative_path):
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# --- 2. LOAD HIDDEN SECRETS ---
# We tell it to look for .env inside the bundled exe
load_dotenv(resource_path(".env"))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    print(" [CRITICAL] Supabase Keys missing in .exe!")
    input("Press Enter to exit...") # Keeps window open so you can read error
    sys.exit()

# --- 3. CONFIGURATION ---
SERIAL_PORT = 'COM3'
BAUD_RATE = 9600
USE_SIMULATION = True 

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
model = None
scaler = None
data_buffer = []
TIMESTEPS = 10

# --- 4. LOAD AI BRAIN (Using resource_path) ---
try:
    model_path = resource_path('iot_sensor_model.h5')
    scaler_path = resource_path('iot_sensor_scaler.pkl')
    
    if os.path.exists(model_path):
        model = tf.keras.models.load_model(model_path)
        scaler = joblib.load(scaler_path)
        print(" [System] AI Brain Loaded Successfully.")
    else:
        print(" [Warning] AI Files not found inside .exe.")
except Exception as e:
    print(f" [Error] Failed to load AI: {e}")

# --- 5. WORKER LOOP ---
def run_agent():
    global data_buffer
    print(" [Agent] Sentinel Client Started.")
    print(" [Cloud] Pushing data to Supabase...")
    print(" [Info] Press Ctrl+C to stop.")
    
    ser = None
    if not USE_SIMULATION:
        try:
            ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
            print(f" [Hardware] Connected to {SERIAL_PORT}")
        except:
            print(" [Error] Hardware not found. Switching to Simulation Mode.")

    while True:
        try:
            # READ
            temp = 0.0
            vib = 0.0
            if ser and ser.isOpen():
                try:
                    line = ser.readline().decode('utf-8').strip()
                    parts = line.split(',')
                    if len(parts) == 2:
                        temp = float(parts[0])
                        vib = float(parts[1])
                except: pass
            else:
                is_spike = random.random() > 0.95
                temp = 45.0 + random.normalvariate(0, 2) + (20 if is_spike else 0)
                vib = 0.2 + random.normalvariate(0, 0.05) + (0.5 if is_spike else 0)

            # PROCESS
            data_buffer.append([temp, vib])
            if len(data_buffer) > TIMESTEPS:
                data_buffer.pop(0)

            is_anomaly = False
            score = 0.0

            if model and scaler and len(data_buffer) == TIMESTEPS:
                input_data = np.array(data_buffer)
                scaled = scaler.transform(input_data)
                reshaped = scaled.reshape(1, TIMESTEPS, 2)
                reconstruction = model.predict(reshaped, verbose=0)
                loss = np.mean(np.abs(reconstruction - reshaped))
                score = float(loss)
                is_anomaly = score > 0.15

            # UPLOAD
            data = {
                "temperature": round(temp, 2),
                "vibration": round(vib, 2),
                "is_anomaly": is_anomaly,
                "anomaly_score": round(score, 4)
            }
            supabase.table("telemetry").insert(data).execute()
            
            # LOG
            status = "🔴 ANOMALY" if is_anomaly else "🟢 NOMINAL"
            print(f" [Sent] T:{temp:.1f} V:{vib:.2f} | {status}")
            
            time.sleep(2.0)
            
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f" [Error] {e}")
            time.sleep(2)

if __name__ == "__main__":
    run_agent()