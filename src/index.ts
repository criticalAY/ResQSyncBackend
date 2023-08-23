require("dotenv").config({ path: "../../.env" })
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import {dbconnect} from "./utils/database";
//require("dotenv").config({ path: "../../.env" })
require('dotenv').config();

const app = express();
const PORT = 5000;
dbconnect();
app.use(cors());
app.use(express.json({limit: '20mb'}));

// Routes
app.use('/api/auth', userRoutes);

app.listen(PORT, () => {
    console.log("Server running at port " + PORT);
});
