import { addNewLoan,getLoanHistroy,updateLoanStatus } from "../services/loanService.js";

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

export const  updateLoanStatusController = async( req,res ) =>{
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