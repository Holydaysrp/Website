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
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch data from the Worker
  const fetchData = async () => {
    const fromTimestamp = Math.floor(new Date(from).getTime() / 1000);
    const toTimestamp = Math.floor(new Date(to).getTime() / 1000);

    if (isNaN(fromTimestamp) || isNaN(toTimestamp)) {
      setError('Please enter valid dates and times.');
      return;
    }

    setIsLoading(true); // Start loading
    setError(null);
    setData(null);

    try {
      const response = await fetch(
        `https://viaches-payloaddata.viaslavdem.workers.dev?from=${fromTimestamp}&to=${toTimestamp}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Prepare chart data
  const chartData = data
    ? {
        labels: Object.keys(data).map((key) =>
          new Date(parseInt(key) * 1000).toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })
        ),
        datasets: [
          {
            label: 'Temperature (°C)',
            data: Object.values(data).map((value) => parseFloat(value.split(',')[0])),
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            tension: 0.4,
          },
          {
            label: 'Humidity (%)',
            data: Object.values(data).map((value) => parseFloat(value.split(',')[1])),
            borderColor: 'rgba(192,75,192,1)',
            backgroundColor: 'rgba(192,75,192,0.2)',
            tension: 0.4,
          },
        ],
      }
    : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Historical Data' },
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
        <button onClick={fetchData}>Fetch Data</button>
         {/* Back to Dashboard Button */}
        <button
          className="navigate-button"
          onClick={() => navigate('/Dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
     
      {/* Loading Bar */}
      {isLoading && <div className="loading-bar">Fetching data...</div>}

      {/* Error Handling */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Chart */}
      {chartData && (
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default HistoricalData;
