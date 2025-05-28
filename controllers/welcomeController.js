const showHomePage = (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Job Portal API</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #333; }
          a { text-decoration: none; color: white; background:rgb(3, 39, 9); padding: 10px 20px; border-radius: 5px; }
          a:hover { background:rgb(6, 70, 57); }
        </style>
      </head>
      <body>
        <h1>Welcome to the Job Portal API 🚀</h1>
        <p>This is a REST API for job listings and applications.</p>
        <a href="/api-docs">📄 View API Documentation</a>
      </body>
    </html>
  `);
};

module.exports = { showHomePage };
