const express = require("express");

const app = express();
const PORT = 3000;


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(require('./routes'))

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})