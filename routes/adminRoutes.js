const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");
const adminController = require("../controllers/authController");
const appController = require("../controllers/appController");
const sliderController = require("../controllers/sliderController");

//============================================================================== Public Routes
router.get("/signup", adminController.renderSignUp);
router.post("/signup", adminController.handleSignUp);

router.get("/login", adminController.renderLogin);
router.post("/login", adminController.handleLogin);

//============================================================================== Apply `isAuthenticated` middleware to all routes
router.use(adminController.checkAdminAuth);

//============================================================================== Protected Routes
router.get("/dashboard", adminController.renderDashboard);
router.get("/update", adminController.renderUpdate);
router.post("/update", adminController.handleUpdatePassword);

router.get("/logout", adminController.handleLogout);

// ========================================================= Render App Routes
router.get("/add-app", appController.AddAppPage);
router.post("/add-app", upload.single("image"), appController.AddApp);
router.get("/all-apps", appController.AllApps);

router.get("/edit-app/:id", appController.EditAppPage);
router.post("/edit-app/:id", upload.single("image"), appController.EditApp);
router.get("/delete-app/:id", appController.DeleteApp);

// ===================================================== Slider Routes
// Routes for Slider operations
router.get("/add-slider", sliderController.addSliderPage);
router.post("/add-slider", upload.single("image"), sliderController.addSlider);
router.get("/all-sliders", sliderController.allSlidersPage);
router.get("/edit-slider/:id", sliderController.updateSliderPage);
router.post(
  "/edit-slider/:id",
  upload.single("image"),
  sliderController.updateSlider
);
router.get("/delete-slider/:id", sliderController.deleteSlider);

module.exports = router;
