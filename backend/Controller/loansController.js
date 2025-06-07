import { addNewLoan,getLoanHistroy } from "../services/loanService";

export const newLoanController = async (req,res) =>{
    try{
        const {txn,borrower,rlusdAmount,xrpAmount} = req.body;
        const response = await addNewLoan(txn,borrower,rlusdAmount,xrpAmount);
        res.status(200).json({ success: true, response: response });
    }catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getLoanHistroyController = async (req, res) =>{
    try {
        const { borrower } = req.body;
        const response = await getLoanHistroy(borrower);
        if(response.success){
            res.status(200).json({ success: true, response: response.loans });
        }
        res.status(200).json({ success: true, response: response.error });
    }catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export default { newLoanController,getLoanHistroyController };