import { updateFunding, getUserFunding } from "../services/lpService.js";
import { updateInterest } from "../services/lpService.js";
import { sendPayment } from "../lib/signer.js";
import { RLUSD_HEX, RLUSD_ISSUER } from "../config.js";

export const reFundController = async (req, res) => {
    try {
        const { userAddress, amount } = req.body;
        const response = await updateFunding(userAddress, amount);
        return res.status(200).json({ success: true, response: response });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const withdrawController = async (req, res) => {
    try {
        const { userAddress, amount } = req.body;            // amount in XRP
        if (!amount || amount <= 0) throw new Error("Invalid amount");

        // 1. check current LP balance
        const { amount: current } = await getUserFunding(userAddress);
        if (Number(current) < amount) throw new Error("Insufficient share");

        // 2. send RLUSD IOU back to LP
        await sendPayment({
            destination: userAddress,
            amount: {
                currency: RLUSD_HEX,
                issuer: RLUSD_ISSUER,
                value: amount.toString()
            },
            memos: [{ type: "LP_WITHDRAW", data: "" }]
        });
        // 3. update DB (negative amount)
        await updateFunding(userAddress, -amount);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Withdraw error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getUserFundingController = async (req, res) => {
    try {
        const { userAddress } = req.body;
        const response = await getUserFunding(userAddress);
        return res.status(200).json({ success: true, response: response });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

//future ganna be deploy on aws cloudwatch
export const updateInterestController = async (req, res) => {
    try {
        const { userAddress, interest } = req.body;
        const response = await updateInterest(userAddress, interest);
        return res.status(200).json({ success: true, response: response });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export default { reFundController, getUserFundingController, updateInterestController, withdrawController }