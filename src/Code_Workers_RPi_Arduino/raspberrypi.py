import paho.mqtt.client as mqtt
import time
import serial


# MQTT settings
broker = ""
port = 8883  
username = ""
password = ""
topic = "sensor/data"
command_topic = "command/topic"

# Initialize serial communication with Ardiuono
ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)  
time.sleep(2)  

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected successfully to broker")
        client.subscribe(command_topic)  # Subscribe to the command topic when connected
    else:
        print(f"Failed to connect, return code {rc}")

# MQTTCallback function for incoming messages
def on_message(client, userdata, msg):
    command = msg.payload.decode()
    print(f"Received command: {command}")
    #Forward the command to the Arduino
    ser.write((command + '\n').encode()) 

# Create an MQTT client instance
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.username_pw_set(username, password)
client.tls_set()  # Enable TLS for secure communication
client.connect(broker, port, keepalive=60)
client.loop_start()

try:
    while True:
        if ser.in_waiting > 0:
            # read data from Arduino
            data = ser.readline().decode('utf-8').strip()
            print(f"Received data: {data}")

            # Publis data to MQTT
            
            client.publish(topic, data)
            time.sleep(1)  

except KeyboardInterrupt:
    print("Terminating...")
finally:
    ser.close()
    client.loop_stop()
    client.disconnect()

