import React from 'react';
import './SliderPage.css'; // For optional custom styles
import SketchImage from './Sketch.png';

function SliderPage() {
  return (
    <div className="slider-page-container" style={{ padding: '2rem', lineHeight: '1.6', fontSize: '1.1rem' }}>
      {/* Title */}

      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <img 
            src={SketchImage} 
            alt="System Sketch" 
            style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}
          />
          <iframe
          width="700"
          height="380"
          src="https://www.youtube.com/embed/inWEOkX8p5w"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        </div>
      <section>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Design and Implementation of a Sensor Data Management System Using Raspberry Pi, Arduino, LabVIEW, and Cloudflare
        </h1>
      </section>

      {/* Abstract */}
      <section>
        <h2>Abstract</h2>
        <p>
          This webpaper presents the design and implementation of a sensor-based monitoring system that integrates LabVIEW,
          HiveMQ MQTT, Raspberry Pi, Arduino, Cloudflare, and a React-based website. The system collects and processes
          sensor data, enabling real-time visualization and historical analysis. The project highlights seamless
          communication between hardware and cloud infrastructure, demonstrating robust functionality across LabVIEW and
          the web application. Cybersecurity considerations and future improvements are discussed.
        </p>
      </section>

      {/* Introduction */}
      <section>
        <h2>1. Introduction</h2>
        <p>
          The need for real-time data collection and monitoring systems is growing in industries such as automation and IoT. This project focuses on a sensor management system that uses <strong>Arduino</strong> for sensor data collection, <strong>Raspberry Pi</strong> for processing and forwarding the data, and <strong>LabVIEW</strong> as a user-friendly control application. The data is stored in <strong>Cloudflare</strong>, making it accessible through a <strong>React-based web interface</strong> for visualization.
        </p>

        <h3>System Overview</h3>
        <ul>
          <li><strong>LabVIEW:</strong> Provides a graphical user interface for controlling and monitoring data.</li>
          <li><strong>HiveMQ MQTT:</strong> Facilitates data transmission between devices using MQTT protocol.</li>
          <li><strong>Raspberry Pi:</strong> Acts as the main processing hub, forwarding data between the Arduino and other components.</li>
          <li><strong>Arduino Uno:</strong> Reads sensor values (e.g., temperature and humidity) and sends data to Raspberry Pi.</li>
          <li><strong>Cloudflare:</strong> Handles data storage using the D1 Database and provides secure access.</li>
          <li><strong>React Web Application:</strong> Displays real-time and historical sensor data to the user.</li>
        </ul>
      </section>

      {/* Methods */}
      <section>
        <h2>2. Methods</h2>
        <h3>2.1 Hardware Integration</h3>
        <p>
          <strong>Arduino and Raspberry Pi Communication</strong><br />
          The Arduino reads data from sensors, such as temperature and humidity sensors. Data is sent from the Arduino to the Raspberry Pi via serial communication (UART). The Raspberry Pi processes the incoming data and publishes it to the HiveMQ MQTT broker.
        </p>
        <p>
          <strong>Why Use Both Arduino and Raspberry Pi?</strong><br />
          The Arduino Uno is used for its simplicity and real-time sensor reading capabilities, while the Raspberry Pi provides processing power for data forwarding, MQTT communication, and cloud interactions.
        </p>

        <h3>2.2 Software Components</h3>
        <p>
          <strong>LabVIEW Application:</strong> Connects to HiveMQ MQTT to visualize and control sensor data.
        </p>
        <p>
          <strong>Cloudflare Integration:</strong> Sensor data is stored in a Cloudflare D1 Database. The table schema used is:
        </p>
        <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
{`CREATE TABLE sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature FLOAT,
    humidity FLOAT,
    distance FLOAT,
    manual_override INTEGER,
    pid_output FLOAT,
    encoder INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);`}
        </pre>

        <p>
          <strong>React Web Application:</strong> Fetches and displays both real-time and historical data via Cloudflare APIs.
        </p>
      </section>

      {/* Results */}
      <section>
        <h2>3. Results</h2>
        <h3>3.1 LabVIEW Functionality</h3>
        <p>LabVIEW successfully displays live sensor data, allows manual overrides, and integrates with HiveMQ MQTT.</p>

        <h3>3.2 Web Application</h3>
        <p>
          The React-based website fetches and visualizes data, improves user navigation through breadcrumbs, and includes security features like logout functionality.
        </p>
      </section>

      {/* Discussion */}
      <section>
        <h2>4. Discussion</h2>
        <h3>Cybersecurity Overview</h3>
        <p>
          Current measures include HTTPS communication, token-based sessions, and authentication. Future work will focus on encryption, access control, and firewalls.
        </p>
      </section>

      {/* Conclusion */}
      <section>
        <h2>5. Conclusion</h2>
        <p>
          This project demonstrates a robust sensor monitoring system integrating hardware, cloud services, and user-friendly interfaces. Future improvements will enhance cybersecurity and system scalability.
        </p>
      </section>

      <section>
        <h2>6. Documentation</h2>
        <p>
        Access the source code on GitHub:{" "}
        <a
          href="https://github.com/Holydaysrp/Website.git"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Website Repository to access Raspberry Pi, Arduino and Cloudflare Worker Code.
        </a>

        <a
          href="https://github.com/Holydaysrp/IIA3220.git"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Repository for Labview Application
        </a>
        
        
      </p>
      </section>
    </div>
  );
}

export default SliderPage;
