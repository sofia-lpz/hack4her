import express from 'express'
import * as controller from './controlService.js'

const router = express.Router();

router.post("/chat", controller.chat);

export { router }