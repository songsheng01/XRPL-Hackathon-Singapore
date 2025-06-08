import express from 'express';
import lpController from '../Controller/lpController.js';

const lpRouter = express.Router();

lpRouter.post('/fund',lpController.reFundController);
lpRouter.post('/info',lpController.getUserFundingController);

export default lpRouter;