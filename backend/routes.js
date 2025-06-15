import express from 'express'
import * as controller from './controller.js'
import { s } from 'framer-motion/client';

const router = express.Router();

router.get("/users", controller.getUsers);
router.get("/stores", controller.getStores);
router.get("/feedback", controller.getFeedback);
router.get("/citas", controller.getCitas);

router.post("/chat", controller.chat);


//funcionales

router.post("/login", controller.login);
router.post("/register", controller.register);

//specialized
// ...existing code...
router.get("/summarized_feedback/:store_id", controller.summarizeFeedback);
// ...existing code...


router.get("/least_visited_stores", controller.getLeastVisitedStores);

router.get("/stats", controller.getStats);

export { router }
