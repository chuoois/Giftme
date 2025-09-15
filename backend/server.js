const express = require('express');
const connectDB = require('./configs/conectDB');
const { env } = require('./configs/environment');
const apiRoutes = require('./routes');
const cors = require('cors');
const path = require('path');

connectDB();
const server = express();
server.use(express.json());
const dirname = path.resolve();

if (env.NODE_ENV === 'development') {
  server.use(cors({ origin: 'http://localhost:5173' }));
}

server.use('/api', apiRoutes);

if (env.NODE_ENV === 'production') {
  server.use(express.static(path.join(dirname, '../client/dist')));

  server.get('*', (req, res) => {
    res.sendFile(path.join(dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 10000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

