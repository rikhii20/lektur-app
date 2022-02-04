const express = require ('express');
const app = express();

require("./startup")(app)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`LEKTUR-APP RUNNiNG AT ${PORT}`));