// src/services/balanceService.js
import { Client, dropsToXrp } from 'xrpl'
import 'dotenv/config';
const { XRPL_ENDPOINT, RLUSD_ISSUER } = process.env
if (!XRPL_ENDPOINT || !RLUSD_ISSUER) {
  throw new Error('请检查 .env，确保 XRPL_ENDPOINT 和 RLUSD_ISSUER 已设置')
}

/**
 * 获取指定地址的 XRP & RLUSD 余额
 * @param {string} address
 * @returns {Promise<{ xrp: string, rlusd: string }>}
 */
export async function getBalances(address) {
  const client = new Client(XRPL_ENDPOINT)
  await client.connect()

  // 1) 查询 XRP（drops → XRP）
  const info = await client.request({
    command: 'account_info',
    account: address,
    ledger_index: 'validated',
  })
  const xrp = dropsToXrp(info.result.account_data.Balance)

  // 2) 查询 IOU 信任线（RLUSD）
  const lines = await client.request({
    command: 'account_lines',
    account: address,
    ledger_index: 'validated',
  })
  const line = lines.result.lines.find(l => l.currency === '524C555344000000000000000000000000000000');
  const rlusd = line ? line.balance : '0'

  await client.disconnect()
  return { xrp, rlusd }
}
