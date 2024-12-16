import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
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
import './HistoricalData.css';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function HistoricalData() {
  const nowUTC = new Date();
  const nowUTCPlus1 = new Date(nowUTC.getTime() + 1 * 60 * 60 * 1000); // Add 1 hour
  const past24HoursUTCPlus1 = new Date(nowUTCPlus1.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago, UTC+1

  const [from, setFrom] = useState(
    past24HoursUTCPlus1.toISOString().slice(0, 16) // Default "from" in UTC+1
  );
  const [to, setTo] = useState(
    nowUTCPlus1.toISOString().slice(0, 16) // Default "to" in UTC+1
  );


  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  // Fetch data from the D1 Database via Worker
  const fetchData = async () => {
    let fromTimestamp, toTimestamp;

    // If no date is selected, default to the last 24 hours
    if (!from || !to) {
      const now = new Date();
      const past24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

      fromTimestamp = past24Hours.toISOString().slice(0, 19); // ISO string without milliseconds
      toTimestamp = now.toISOString().slice(0, 19);
      setFrom(fromTimestamp.replace("T", " "));
      setTo(toTimestamp.replace("T", " "));
    } else {
      // Use user-specified date/time range
      fromTimestamp = new Date(from).toISOString().slice(0, 19);
      toTimestamp = new Date(to).toISOString().slice(0, 19);
    }

    setIsLoading(true);
    setError(null);
    setData([]);

    try {
      const response = await fetch(
        `https://viaches-payloaddata.viaslavdem.workers.dev/sensor-data?from=${encodeURIComponent(
          fromTimestamp
        )}&to=${encodeURIComponent(toTimestamp)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      console.log("Fetched Data:", result); // Log fetched data for debugging
      setData(result); // Set data for chart
    } catch (err) {
      setError('Error fetching data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  // Prepare chart data
  const chartData = {
    labels: data.map((item) => {
      const date = new Date(item.timestamp);
      return date.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    }),

    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.map((item) => item.temperature),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.4,
      },
      {
        label: 'Humidity (%)',
        data: data.map((item) => item.humidity),
        borderColor: 'rgba(192,75,192,1)',
        backgroundColor: 'rgba(192,75,192,0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Historical Data from D1 Database' },
    },
    scales: {
      x: { title: { display: true, text: 'Timestamp' } },
      y: { title: { display: true, text: 'Value' } },
    },
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Historical Data</h1>
      <p>Fetch sensor data by specifying a date and time range.</p>

      {/* Date/Time Input */}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          From:
          <input
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label>
          To:
          <input
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
        <button onClick={fetchData} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch Data'}
        </button>
        <button
          className="navigate-button"
          onClick={() => navigate('/Dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && <div className="loading-bar">Fetching data...</div>}

      {/* Error Handling */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Chart */}
      {data.length > 0 && (
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default HistoricalData;
