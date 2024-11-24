import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom'; // For navigation
import './Dashboard.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
    const [messages, setMessages] = useState([]);
    const [parsedData, setParsedData] = useState({});
    const [selectedMetric, setSelectedMetric] = useState('temperature');
    const [status, setStatus] = useState('Disconnected');
    const [command, setCommand] = useState('');
    const [client, setClient] = useState(null);

    const navigate = useNavigate(); // For logout navigation

    const availableCommands = [
        { label: 'Set Temperature Setpoint', value: 'SETPOINT' },
        { label: 'Set Tolerance', value: 'TOLERANCE' },
        { label: 'Set Hysteresis', value: 'HYSTERESIS' },
        { label: 'Set Fan Minimum Speed', value: 'FAN_MIN_SPEED' },
        { label: 'Set Distance Threshold', value: 'DISTANCE' },
        { label: 'Set PID Parameters (Kp,Ki,Kd)', value: 'PID' },
        { label: 'Toggle Alarm Mode', value: 'ALARM' },
        { label: 'Toggle Manual Mode', value: 'MANUAL' },
    ];

    const [selectedCommand, setSelectedCommand] = useState(availableCommands[0].value); // Default to first command
    const [commandValue, setCommandValue] = useState('');

    // Handle sending commands
    const sendCommand = () => {
        if (client && selectedCommand && commandValue.trim() !== '') {
            const fullCommand = `${selectedCommand}=${commandValue}`;
            client.publish('command/topic', fullCommand, (err) => {
                if (err) {
                    console.error('Failed to send command:', err);
                } else {
                    console.log('Command sent:', fullCommand);
                }
            });
            setCommandValue(''); // Clear the input field
        }
    };


    useEffect(() => {
        // Connect to HiveMQ broker
        const mqttClient = mqtt.connect('wss://ce06b4f8ae4542a08357c542c4882795.s1.eu.hivemq.cloud:8884/mqtt', {
            username: 'CustomerAdmin',
            password: 'CustomerAdmin1',
            rejectUnauthorized: true,
        });

        setClient(mqttClient);

        // Check connection state periodically
        const interval = setInterval(() => {
            if (mqttClient.connected) {
                setStatus('Connected');
            } else {
                setStatus('Disconnected');
            }
        }, 1000); // Check every second

        mqttClient.on('connect', () => {
            console.log('MQTT client connected');
            setStatus('Connected'); // Update status on connection
            mqttClient.subscribe('sensor/data', (err) => {
                if (err) {
                    console.error('Failed to subscribe:', err);
                }
            });
        });

        mqttClient.on('message', (topic, message) => {
            const rawMessage = message.toString();
            const timestamp = Date.now();

            const [temperature, humidity, distance, manualMode, fanOutput, position] = rawMessage.split(',');

            setMessages((prevMessages) => {
                const updatedMessages = [
                    ...prevMessages,
                    { timestamp, topic, data: { temperature, humidity, distance, manualMode, fanOutput, position } },
                ];
                return updatedMessages.slice(-10); // Limit to last 10 messages
            });

            setParsedData((prevData) => ({
                ...prevData,
                [timestamp]: { temperature, humidity, distance, manualMode, fanOutput, position },
            }));
        });

        mqttClient.on('error', (err) => {
            console.error('MQTT Error:', err);
            setStatus('Error');
        });

        mqttClient.on('close', () => {
            console.log('MQTT client disconnected');
            setStatus('Disconnected');
        });

        // Cleanup on component unmount
        return () => {
            mqttClient.end();
            clearInterval(interval);
        };
    }, []);


    // Handle logout
    const logout = () => {
        if (client) {
            client.end(); // Disconnect the client
        }
        setMessages([]); // Clear messages
        setParsedData({}); // Clear parsed data
        setStatus('Disconnected'); // Update status
        navigate('/'); // Redirect to login page
    };

    // Chart data and options
    const chartData = {
        labels: Object.keys(parsedData).map((timestamp) =>
            new Date(Number(timestamp)).toLocaleTimeString('en-GB', { hour12: false })
        ),
        datasets: [
            {
                label: selectedMetric,
                data: Object.values(parsedData).map((entry) => Number(entry[selectedMetric])),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `${selectedMetric} Over Time` },
        },
        scales: {
            x: { title: { display: true, text: 'Timestamp' } },
            y: { title: { display: true, text: selectedMetric } },
        },
    };

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <p className={`status ${status.toLowerCase()}`}>Status: {status}</p>

            {/* Logout Button */}
            <div className="logout-container">
                <button className="logout-button" onClick={logout}>
                    Logout
                </button>
            </div>

            {/* Metric Selector */}
            <div className="metric-selector">
                <label htmlFor="metric">Select Metric: </label>
                <select
                    id="metric"
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                >
                    <option value="temperature">Temperature (°C)</option>
                    <option value="humidity">Humidity (%)</option>
                    <option value="distance">Distance (cm)</option>
                    <option value="fanOutput">Fan Output (%)</option>
                    <option value="position">Position</option>
                </select>
            </div>

            {/* Chart */}
            <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
            </div>

            {/* Command Input */}
            <div className="command-input">
                <label htmlFor="command-dropdown">Select Command: </label>
                <select
                    id="command-dropdown"
                    value={selectedCommand}
                    onChange={(e) => setSelectedCommand(e.target.value)}
                >
                    {availableCommands.map((cmd) => (
                        <option key={cmd.value} value={cmd.value}>
                            {cmd.label}
                        </option>
                    ))}
                </select>

                <label htmlFor="command-value">Enter Value: </label>
                <input
                    id="command-value"
                    type="text"
                    value={commandValue}
                    onChange={(e) => setCommandValue(e.target.value)}
                    placeholder="Enter value (e.g., 25.5)"
                />

                <button onClick={sendCommand}>Send</button>
            </div>

            {/* Raw Data */}
            <div className="raw-data">
                <h2>Raw Messages (Last 10):</h2>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>
                            <strong>
                                {new Date(msg.timestamp).toLocaleTimeString('en-GB', { hour12: false })}
                                :</strong>{' '}
                            {msg.topic} - {JSON.stringify(msg.data)}
                        </li>
                    ))}
                </ul>
            </div>;
        </div>
    );
}

export default Dashboard;
