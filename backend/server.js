require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error connecting to the database: ${err.message}`);
    process.exit(1);
  });
