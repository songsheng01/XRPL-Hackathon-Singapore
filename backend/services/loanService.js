import { createLoan,scanAll,updateInterest } from "../models/loanModel.js";

export const addNewLoan = async(txn,borrower,rlusdAmount,xrpAmount) =>{
    try {
        await createLoan(txn,borrower,rlusdAmount,xrpAmount);
        return {success: true};
    } catch(error){
        console.error("error create the loan", error);
        return {success: false, error:error.message};
    }
}
export const getLoanHistroy = async (borrower) =>{
    try {
        const allLoans = await scanAll();
        const loans = allLoans.filter(item => item.borrower === borrower);
        return {
            success: true,
            loans
        };
    } catch(error){
        console.error("error get the loan history", error);
        return {success: false, error:error.message};
    }
}
