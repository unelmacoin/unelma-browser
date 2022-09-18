require("dotenv").config();
const { App } = require("./main/Services/App");
new App();
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";