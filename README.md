# APM/LPM to Server Connection through AWS IoT Core

This project implements a connection between an APM or LPM device and a server using AWS IoT Core as the MQTT client. The goal is to facilitate communication between the device and the server, enabling real-time data exchange and monitoring.

## Overview

This repository contains code to establish an MQTT connection between an APM/LPM device and AWS IoT Core. The MQTT protocol is used for lightweight and efficient message exchange. The server-side code handles incoming messages from the device and processes them accordingly.

## Features

- **MQTT Communication**: Establishes an MQTT connection to AWS IoT Core for data transmission.
- **AWS IoT Core Integration**: Configured to connect to AWS IoT Core, handling authentication and message routing.
- **Device-to-Server Communication**: Facilitates real-time data transmission from APM/LPM devices to the server.

## Getting Started

### Prerequisites

- **AWS Account**: You need an AWS account to access AWS IoT Core.
- **AWS CLI**: Ensure the AWS CLI is installed and configured on your local machine.
- **Node.js**: This project requires Node.js. [Download and install Node.js](https://nodejs.org/).

### Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ankurauti1234/Device_to_server_mqtt.git
   cd Device_to_server_mqtt
   ```

2. **Install Dependencies**

   Ensure you have the necessary dependencies installed:

   ```bash
   npm install
   ```

3. **Configure AWS IoT Core**

   - Create a new IoT Core thing in the AWS Management Console.
   - Generate and download the device certificate and private key.
   - Configure the AWS IoT Core endpoint in the code.

4. **Update Configuration**

   - Create a `.env` file in the root directory and add the following environment variables:

     ```env
     AWS_IOT_ENDPOINT=<your-iot-endpoint>
     AWS_IOT_PORT=<your-iot-port>
     AWS_IOT_THING_NAME=<your-thing-name>
     AWS_IOT_CERT_PATH=<path-to-your-certificate>
     AWS_IOT_KEY_PATH=<path-to-your-private-key>
     ```

   Replace placeholders with actual values from your AWS IoT Core setup.

5. **Run the Application**

   Start the application:

   ```bash
   node index.js
   ```

## Usage

- The device will connect to AWS IoT Core using MQTT.
- Messages will be sent from the device to the server, where they can be processed and stored.
