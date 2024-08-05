from awscrt import mqtt
from awsiot import mqtt_connection_builder
import time
import msgpack
import logging
import random
import json

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Replace with your information
endpoint = "a3uoz4wfsx2nz3-ats.iot.ap-south-1.amazonaws.com"
client_id = "test"
cert_filepath = "./test.cert.pem.crt"
pri_key_filepath = "./test.private.pem.key"
ca_filepath = "./root-CA.crt"

# Topics
json_topic = "sensor/data"
msgpack_topic = "sensor/data/msgpack"

# Callback functions
def on_connection_interrupted(connection, error, **kwargs):
    logging.warning(f"Connection interrupted. error: {error}")

def on_connection_resumed(connection, return_code, session_present, **kwargs):
    logging.info(f"Connection resumed. return_code: {return_code} session_present: {session_present}")

def on_connection_success(connection, callback_data):
    logging.info("Connection Successful")

def on_connection_failure(connection, callback_data):
    logging.error(f"Connection failed with error: {callback_data.error}")

def on_connection_closed(connection, callback_data):
    logging.info("Connection closed")

# Create MQTT connection
mqtt_connection = mqtt_connection_builder.mtls_from_path(
    endpoint=endpoint,
    cert_filepath=cert_filepath,
    pri_key_filepath=pri_key_filepath,
    ca_filepath=ca_filepath,
    client_id=client_id,
    clean_session=False,
    keep_alive_secs=30,
    on_connection_interrupted=on_connection_interrupted,
    on_connection_resumed=on_connection_resumed,
    on_connection_success=on_connection_success,
    on_connection_failure=on_connection_failure,
    on_connection_closed=on_connection_closed)

logging.info(f"Connecting to {endpoint} with client ID '{client_id}'...")

connect_future = mqtt_connection.connect()
connect_future.result()
logging.info("Connected!")

try:
    while True:
        # JSON Data
        json_data = {
            "device_id": "rpi-001",
            "timestamp": int(time.time()),
            "temperature": round(random.uniform(20.0, 45.0), 1),
            "humidity": round(random.uniform(50.0, 70.0), 1)
        }
        json_payload = json.dumps(json_data)
        logging.debug(f"Publishing JSON data: {json_payload}")

        publish_future, packet_id = mqtt_connection.publish(
            topic=json_topic,
            payload=json_payload,
            qos=mqtt.QoS.AT_LEAST_ONCE)
        
        publish_future.result()
        logging.info(f"Published JSON message with packet id: {packet_id}")

        # MessagePack Data
        msgpack_data = {
            "device_id": "rpi-001",
            "timestamp": int(time.time()),
            "pressure": round(random.uniform(900.0, 1100.0), 1),
            "light_level": round(random.uniform(100.0, 800.0), 1)
        }
        msgpack_payload = msgpack.packb(msgpack_data)
        logging.debug(f"Publishing MessagePack data: {msgpack_payload}")

        publish_future, packet_id = mqtt_connection.publish(
            topic=msgpack_topic,
            payload=msgpack_payload,
            qos=mqtt.QoS.AT_LEAST_ONCE)
        
        publish_future.result()
        logging.info(f"Published MessagePack message with packet id: {packet_id}")

        time.sleep(2)  # Publish every 2 seconds

except KeyboardInterrupt:
    logging.info("Disconnecting...")
    disconnect_future = mqtt_connection.disconnect()
    disconnect_future.result()
    logging.info("Disconnected!")

except Exception as e:
    logging.error(f"An error occurred: {e}")
    disconnect_future = mqtt_connection.disconnect()
    disconnect_future.result()
    logging.info("Disconnected due to error!")
