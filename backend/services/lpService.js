import { createLP, checkIfExists, getUserAmount, updateAmount } from "../models/lpModel.js";

//用于处理充值或者提出rlusd
export const updateFunding = async(userAddress,amount) => {
    try{
        const ifexists = await checkIfExists(userAddress);
        if(!ifexists){
            await createLP(userAddress,amount);
            return {
                success: true,
                amount: amount
            }
        }
        let new_amount = await getUserAmount(userAddress);
        new_amount += Number(amount);
        const response = await updateAmount(userAddress,new_amount);
        return{
            success: true,
            amount: response
        }
    } catch(error) {
        console.error("error get the loan history", error);
        return {success: false, error:error.message};
    }
}

export const getUserFunding = async (userAddress) =>{
    try {
        const response = await getUserAmount(userAddress);
        return{
            success: true,
            amount: response
        }
    } catch(error) {
        console.error("error get the loan history", error);
        return {success: false, error:error.message};
    }
}

//根据利率更新最新的用户rlusd总量
export const updateInterest = async (userAddress,interest) => {
    try{
        let amount = await getUserAmount(userAddress);
        amount = Number(amount) * (1  + interest);
        const response = await updateAmount(userAddress,amount);
         return{
            success: true,
            amount: response
        }
    }catch(error) {
        console.error("error get the loan history", error);
        return {success: false, error:error.message};
    }
}