"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({ path: "../../.env" });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const database_1 = require("./utils/database");
//require("dotenv").config({ path: "../../.env" })
require('dotenv').config();
const app = (0, express_1.default)();
const PORT = 5000;
(0, database_1.dbconnect)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '20mb' }));
// Routes
app.use('/api/auth', userRoutes_1.default);
app.listen(PORT, () => {
    console.log("Server running at port " + PORT);
});
