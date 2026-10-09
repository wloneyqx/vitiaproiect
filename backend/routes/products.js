const express = require("express");
const controller = require("../controllers/productsController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", controller.list);
router.get("/:slug", controller.bySlug);
router.post("/", requireAdmin, controller.create);
router.put("/:id", requireAdmin, controller.update);
router.delete("/:id", requireAdmin, controller.remove);

module.exports = router;
