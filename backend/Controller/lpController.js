import { updateFunding,getUserFunding } from "../services/lpService.js";
import { updateInterest } from "../services/lpService.js";

export const reFundController = async (req,res) =>{
    try {
        const {userAddress,amount} = req.body;
        const response = await updateFunding(userAddress,amount);
        return res.status(200).json({ success: true, response: response });
    }catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getUserFundingController = async (req,res) =>{
    try {
        const {userAddress} = req.body;
        const response = await getUserFunding(userAddress);
        return res.status(200).json({ success: true, response: response });
    }catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

//future ganna be deploy on aws cloudwatch
export const updateInterestController = async (req,res) =>{
    try {
        const {userAddress,interest} = req.body;
        const response = await updateInterest(userAddress,interest);
        return res.status(200).json({ success: true, response: response });
    }catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export default {reFundController,getUserFundingController,updateInterestController}