import express from 'express'
import * as controller from './controller.js'

const router = express.Router();

router.get("/users", controller.getUsers);
router.get("/stores", controller.getStores);
router.get("/feedback", controller.getFeedback);
router.get("/citas", controller.getCitas);

router.post("/chat", controller.chat);


//funcionales

router.post("/login", controller.login);
router.post("/register", controller.register);

//specialized by user

//router.get("/userappointments/:userId", controller.getUserAppointments);
//router.get("/userfeedback/:userId", controller.getUserFeedback);


export { router }
