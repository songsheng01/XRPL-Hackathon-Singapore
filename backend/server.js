import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "xrpl";
import loansRouter from "./routes/loans.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

/* sample endpoint: return server ledger height */
app.get("/api/ledger", async (_req, res) => {
  const client = new Client("wss://hooks-testnet-v3.xrpl-labs.com");
  await client.connect();
  const info = await client.request({ command: "ledger", ledger_index: "validated" });
  await client.disconnect();
  res.json({ height: info.result.ledger.ledger_index });
});

app.use('/loans',loansRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`)
});
