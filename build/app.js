"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
/*
 *  Create express server instance.
 */
const app = express_1.default();
/*
 * Express configuration
 */
app.use(express_1.default.json({ limit: "5mb" }));
app.use(express_1.default.urlencoded({ limit: "5mb", extended: false }));
app.use(cors_1.default());
app.use(express_fileupload_1.default({
    createParentPath: true,
}));
/**
 * env variables Configuration
 */
const result = dotenv_1.default.config({ path: path_1.default.join(__dirname, "../", ".env") });
if (result.error)
    throw result.error;
app.use((req, res, next) => {
    console.log(req.url, req.baseUrl);
    next();
});
/**
 * Express Server
 */
let PORT = process.env.PORT || 3000;
/* HTTP Configutation */
var server = app.listen(PORT, function () {
    console.log("Example app listening on port " + PORT + "!");
});
/*
 * Primary app routes.
 */
app.use("/v1", require("./v1"));
module.exports = server;
//# sourceMappingURL=app.js.map