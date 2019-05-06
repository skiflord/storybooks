const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.get('/', (req, res) => res.send('It works!'));

const port = process.env.port || 8000;
app.listen(port, () => console.log(`Server run... on port ${port}`));