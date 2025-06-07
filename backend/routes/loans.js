import express from 'express';
import loansController from '../Controller/loansController.js';

const loansRouter = express.Router();

loansRouter.post('/new',loansController.newLoanController);
loansRouter.post('/history',loansController.newLoanController);

export default loansRouter;