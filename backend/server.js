import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "xrpl";
import loansRouter from "./routes/loans.js";
import oracleRouter from "./routes/oracle.js";
import lpRouter from "./routes/lp.js";
import mainRouterRouter from "./routes/mainWalletInfo.js";
import "./services/oracleService.js";
import 'dotenv/config';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/oracle", oracleRouter);
app.use('/loans',loansRouter);
app.use('/lp',lpRouter);
app.use('/mainwallet',mainRouterRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
