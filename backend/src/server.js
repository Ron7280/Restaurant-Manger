const https = require("https");
const fs = require("fs");
const app = require("./app");
const { IP } = require("./API");

const options = {
  key: fs.readFileSync("./certs/private.key"),
  cert: fs.readFileSync("./certs/certificate.crt"),
};

const PORT = process.env.PORT;

https.createServer(options, app).listen(PORT, IP, () => {
  console.log(`HTTPS server running on https://${IP}:${PORT}`);
});
