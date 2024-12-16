import React from 'react';

const VersionLog = () => {
  const changes = [
    {
      version: '1.0.0',
      date: '2024-12-15',
      changes: [
        'Initial implementation of registration and login workflows.',
        'Integrated Cloudflare Worker for user authentication using KV storage.',
        'Added email confirmation functionality using Resend API.',
      ],
    },
    {
      version: '1.1.0',
      date: '2024-12-15',
      changes: [
        'Implemented CORS headers to allow cross-origin requests.',
        'Fixed issue with missing Access-Control-Allow-Origin header in Worker responses.',
        'Enhanced error handling for Resend API failures in Worker.',
        'Improved email content and added support for verification tokens.',
      ],
    },
    {
      version: '1.2.0',
      date: '2024-12-15',
      changes: [
        'Merged `register` and `sendEmail` Workers into a single Worker for simplified deployment.',
        'Verified that email confirmation links are functional and correctly update the user’s verification status.',
        'Resolved issues with React app failing to display proper error messages for failed registrations.',
        'Updated the email confirmation alert to notify users about spam folder checks.',
        'Added loading state in React app to improve UX during registration and login processes.',
      ],
    },
    {
      version: '1.3.0',
      date: '2024-12-15',
      changes: [
        'Improved email handling in Worker to include detailed logging of Resend API responses for debugging.',
        'Enhanced feedback for users during registration and login workflows.',
        'Added clear spam folder notice in the registration success message.',
        'Debugged and resolved error "Body has already been used" in Worker fetch requests.',
        'Validated that email functionality works end-to-end from React app.',
      ],
    },
    {
      version: '2.0.0',
      date: '2024-12-15',
      changes: [
        'Swapped KV storage with D1 database for logging payload data from MQTT LabView Control Application.',
        'Updated Historical Data page to retrieve data from D1 instead of KV storage, ensuring improved performance and scalability.',
        'Refactored LabView Control Application to send payload data to D1 database for better tracking and storage.',
        'Tested and confirmed the functionality of the D1 database for retrieving and logging data.',
        'Improved the integration between LabView, MQTT, and the backend by utilizing D1 for more efficient data handling and queries.',
      ],
    },
    {
      version: '2.1.0',
      date: '2024-12-16',
      changes: [
        'Added UTC+1 timezone adjustment for data display on the Historical Data page.',
        'Fixed default date range selection to show the last 24 hours if no input is provided.',
        'Improved chart rendering by handling edge cases when data is missing or incomplete.',
        'Refined the system sketch to include functionality descriptions for each component.',
        'Added breadcrumb navigation and centralized menu buttons for improved UI/UX.',
        'Integrated a Logout button within the menu for better accessibility and session handling.',
      ],
    },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Version Log</h1>
      {changes.map((entry, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h2>Version {entry.version}</h2>
          <p><strong>Date:</strong> {entry.date}</p>
          <ul>
            {entry.changes.map((change, i) => (
              <li key={i}>{change}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default VersionLog;
