
const express = require("express");
require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(require('./routes'))

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
    
})