import 'dotenv/config';
import express from 'express';
import { getBalances } from '../lib/mainWallet.js';

const mainRouterRouter = express.Router();
const { WALLET_ADDRESS } = process.env;
if (!WALLET_ADDRESS) {
  throw new Error('Please check wallet_address')
}

mainRouterRouter.get('/balance', async (req, res) => {
  try {
    const balances = await getBalances(WALLET_ADDRESS)
    res.json({
      success: true,
    //   address: WALLET_ADDRESS,
      balances
    })
  } catch (err) {
    console.error('查询余额出错:', err)
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
})

export default mainRouterRouter;