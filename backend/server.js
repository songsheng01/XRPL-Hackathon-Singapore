import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "xrpl";
import loansRouter from "./routes/loans.js";
import oracleRouter from "./routes/oracle.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/oracle", oracleRouter);
app.use('/loans',loansRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
