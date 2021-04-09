const express = require('express');
const app = express();
const port = 8000;

app.get('/', (req, res) => res.send("<h1>Welcome!!</h1><p>This is <mark>Kermit</mark> World!</p>"));

app.listen(port, () => console.log(`Start Kermit Server on port ${port}`));