const express = require('express');
const ConnectToMongo = require('./db');
var cors = require('cors');

ConnectToMongo();
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());


app.use('/api/auth', require('./router/auth'));


app.listen(port,() => {
    console.log(`Backend to listing at http://localhost:${port}`);
})