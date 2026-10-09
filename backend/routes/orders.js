const express = require("express");
const controller = require("../controllers/ordersController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/admin/all", requireAdmin, controller.adminList);
router.patch("/admin/:id/status", requireAdmin, controller.status);
router.post("/", controller.create);
router.get("/:id", controller.byId);

module.exports = router;
