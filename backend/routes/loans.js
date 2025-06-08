import express from 'express';
import loansController from '../controllers/loansController.js';

const loansRouter = express.Router();

loansRouter.post('/borrow', loansController.newLoanController);
loansRouter.post('/history', loansController.getLoanHistroyController);
loansRouter.post('/update' ,loansController.updateLoanStatusController);
loansRouter.post("/repay", loansController.repayLoanController);
loansRouter.post('/interest',loansController.updateInterestController);

export default loansRouter;