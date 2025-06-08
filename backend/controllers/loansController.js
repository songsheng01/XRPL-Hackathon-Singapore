import { addNewLoan, getLoanHistroy, updateLoanStatus } from "../services/loanService.js";
import { repayLoan } from "../services/loanService.js";
import { latestPx } from "../services/oracleService.js";
import { sendPayment } from "../lib/signer.js";
import { RLUSD_HEX, RLUSD_ISSUER } from "../config.js";
import { updateInterest } from "../models/loanModel.js";

export const newLoanController = async (req, res) =>{
    try {
        const {borrower, xrpAmount} = req.body;
        console.log(borrower)
        console.log(xrpAmount)
        /* ---------------- LTV 50 % : compute RLUSD out ---------------- */
        if (!latestPx) throw new Error("Oracle price not ready");
        const rlusdAmount = (Number(xrpAmount) * latestPx * 0.5).toFixed(6);
        console.log(rlusdAmount)

        /* ---------------- Send RLUSD from the pool wallet ------------- */
        const txHash = await sendPayment({
          destination: borrower,
          amount: { currency: RLUSD_HEX, issuer: RLUSD_ISSUER, value: rlusdAmount },
          memos: [{ type: "BORROW", data: "" }]
        });

        console.log(txHash)

        /* ---------------- Persist loan row ---------------------------- */
        const response = await addNewLoan(txHash, borrower, rlusdAmount, xrpAmount);

        res.status(200).json({ success: true, response: response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getLoanHistroyController = async (req, res) => {
    try {
        // const { borrower } = req.body;
        const response = await getLoanHistroy();
        if(response.success){
            return res.status(200).json({ success: true, response: response.allLoans  });
        }
        return res.status(400).json({ success: true, response: response.error });
    }catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const  updateLoanStatusController = async( req,res ) => {
    try {
        const {txn,type} = req.body;
        const response = await updateLoanStatus(txn,type);
        if(response.success){
            return res.status(200).json({ success: true, response: response.allLoans  });
        }
        return res.status(400).json({ success: true, response: response.error });
    }catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateInterestController = async (req,res) =>{
    try {
        const {txn} = req.body;
        const response = await updateInterest(txn);
        return res.status(200).json({ success: true, response: response });
    }catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const repayLoanController = async (req, res) => {
  try {
    const { loanId } = req.body;
    const loan = await repayLoan(loanId);        // returns closed loan row

    // send collateral back to borrower
    await sendPayment({
      destination: loan.borrower.S,
      amount: ((Number(loan.xrpAmount.N) * 1_000_000).toString()),
      memos: [{ type: "REPAY", data: loanId }]
    });

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export default { newLoanController, getLoanHistroyController, updateLoanStatusController, repayLoanController, updateInterestController };