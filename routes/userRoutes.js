const express = require("express");
const router = express.Router();
const App = require("../models/appModel");
const { getAllAppsIndex } = require("../controllers/appController");
const { getAllSliderIndex } = require("../controllers/sliderController");

router.get("/", async (req, res) => {
  try {
    const apps = await getAllAppsIndex(); 
    const sliders = await getAllSliderIndex(); 
    res.render("user-ui/index.ejs", { apps, sliders });
  } catch (err) {
    console.error("Error fetching data for the index page:", err);
    res.status(500).render("error", {
      title: "Error",
      message:
        "An error occurred while loading the page. Please try again later.",
    });
  }
});

// Route to fetch a specific app by ID
router.get("/app/:id", async (req, res) => {
  try {
    const allApps = await getAllAppsIndex(); 
    const { id } = req.params;
    const app = await App.findById(id); 

    if (!app) {
      return res.status(404).render("error", {
        title: "App Not Found",
        message: "The app you are looking for does not exist.",
      });
    }

    res.render("user-ui/app-details.ejs", { app, allApps });
  } catch (err) {
    console.error("Error fetching data for the app page:", err);
    res.status(500).render("error", {
      title: "Error",
      message:
        "An error occurred while loading the app details. Please try again later.",
    });
  }
});

module.exports = router;
