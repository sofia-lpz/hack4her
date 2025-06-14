import express from 'express'
import * as controller from './controller.js'

const router = express.Router();

router.get("/users", controller.getUsers);
router.get("/stores", controller.getStores);
router.get("/feedback", controller.getFeedback);
router.get("/citas", controller.getCitas);


router.post("/chat", controller.chat);

export { router }
