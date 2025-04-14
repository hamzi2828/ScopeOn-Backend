/**
 * Generates an HTML welcome page for the ScopeOn API
 * @returns {string} HTML content for the welcome page
 */
const getWelcomePage = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ScopeOn API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f5f5f5;
          flex-direction: column;
        }
        .welcome-container {
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 600px;
        }
        h1 {
          color: #333;
          margin-bottom: 1rem;
        }
        p {
          color: #666;
          margin-bottom: 1.5rem;
        }
        .api-link {
          margin-top: 1rem;
        }
        .api-link a {
          color: #0070f3;
          text-decoration: none;
        }
        .api-link a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="welcome-container">
        <h1>Welcome to ScopeOn API</h1>
        <p>Your backend server is running successfully!</p>
        <div class="api-link">
          <a href="/api-docs">View API Documentation</a>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = getWelcomePage;
