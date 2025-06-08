import { addNewLoan, getLoanHistroy, updateLoanStatus } from "../services/loanService.js";
import { latestPx } from "../services/oracleService.js";              // live RLUSD→XRP
import { sendPayment } from "../lib/signer.js";
import { RLUSD_HEX, RLUSD_ISSUER } from "../config.js";

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

export default { newLoanController,getLoanHistroyController,updateLoanStatusController  };