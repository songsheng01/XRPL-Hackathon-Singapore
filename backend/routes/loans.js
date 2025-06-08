import express from 'express';
import loansController from '../Controller/loansController.js';

const loansRouter = express.Router();

loansRouter.post('/new',loansController.newLoanController);
loansRouter.post('/history',loansController.getLoanHistroyController);
loansRouter.post('/update',loansController.updateLoanStatusController);
loansRouter.post('/interest',loansController.updateInterestController);

export default loansRouter;