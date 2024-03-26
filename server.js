const app = require('./app');
const env = require('dotenv').config();

// Rest of your code goes here

port= process.env.port || 3000;
console.log(port);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
