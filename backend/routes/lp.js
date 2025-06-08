import express from 'express';
import lpController from '../controllers/lpController.js';

const lpRouter = express.Router();

lpRouter.post('/fund',lpController.reFundController);
lpRouter.post("/withdraw", lpController.withdrawController);
lpRouter.post('/info',lpController.getUserFundingController);
lpRouter.post('/interest',lpController.updateInterestController);

export default lpRouter;