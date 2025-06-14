import express from 'express'
import * as controller from './controlService.js'

const router = express.Router();

router.get("/carreras",  controller.getCarreras);

router.post("/chat", controller.chat);

export { router }