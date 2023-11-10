require("dotenv").config();
require('v8-compile-cache');
const { App } = require("./main/Services/App");
new App();
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
