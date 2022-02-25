const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Lektur-app is running at port ${PORT}`));

module.exports = server;
