const app = require('./app');
const path = require('path');
const envPath = path.resolve(__dirname, 'configs/.env');
console.log(envPath);
//const env = require('dotenv').config({ path: envPath});
const dotenv = require('dotenv');
try {
    dotenv.config({ path: envPath });
    console.log('Environment variables loaded successfully.');
} catch (error) {
    console.error('Error loading environment variables:', error);
}
console.log(process.env.port);
// Rest of your code goes here

port= process.env.port || 3000;
console.log(port);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
