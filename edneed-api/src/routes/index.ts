import express from "express";
import DomainController from "../controllers/domainController";

const router = express.Router();

router.get("/domain", async (_req, res) => {
  const controller = new DomainController();
  const response = await controller.getDomain(_req, res);
  return res.send(response);
});

router.post("/domain", async (_req, res) => {
  const controller = new DomainController();
  const response = await controller.addDomain(_req, res);
  return res.send(response);
});

// router.get("/domain/all", async (_req, res) => {
//   const controller = new DomainController();
//   const response = await controller.getDomains();
//   return res.send(response);
// });

export default router;