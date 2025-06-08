import { createLoan, scanAll, updateInterest, updateStatus } from "../models/loanModel.js";

export const addNewLoan = async (txn, borrower, rlusdAmount, xrpAmount) => {
    try {
        await createLoan(txn, borrower, rlusdAmount, xrpAmount);
        return { success: true };
    } catch (error) {
        console.error("error create the loan", error);
        return { success: false, error: error.message };
    }
}
export const getLoanHistroy = async () => {
    try {
        const allLoans = await scanAll();
        return {
            success: true,
            allLoans
        };
    } catch (error) {
        console.error("error get the loan history", error);
        return { success: false, error: error.message };
    }
}

export const updateLoanStatus = async (txn, type) => {
    try {
        const response = await updateStatus(txn, type);
        if (response) {
            const allLoans = await scanAll();
            return {
                success: true,
                allLoans
            };
        }
        return {
            success: false,
            error: "unsuccessful update"
        }
    } catch (error) {
        console.error("error get the loan history", error);
        return { success: false, error: error.message };
    }
}

export const repayLoan = async (loanId) => {
    /* mark CLOSED and return the row */
    const closed = await updateStatus(loanId, "closed");
    return closed;
};