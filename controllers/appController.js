const App = require("../models/appModel");

// Display Add App Form
const AddAppPage = (req, res) => {
  res.render("admin-ui/addApp");
};

// Handle Add App Submission
const AddApp = async (req, res) => {
  try {
    const {
      name,
      rank,
      reviews,
      size,
      downloads,
      price,
      description,
      downloadUrl,
      seoTitle,
      seoKeyword,
      seoDescription,
      faq, // Include faq in the request body
    } = req.body;

    const image = req.file ? req.file.path : ""; // Ensure image path is set

    // Validate required fields
    if (!name || !price || !description || !downloadUrl) {
      return res.status(400).send("Missing required fields.");
    }

    // Parse faq if it's a string, otherwise directly use the array
    let parsedFaq = [];
    if (faq) {
      // If faq is a string, parse it, otherwise directly use it
      parsedFaq = typeof faq === "string" ? JSON.parse(faq) : faq;
    }

    // Create a new app entry
    const app = new App({
      name,
      downloadUrl,
      price,
      reviews,
      size,
      downloads,
      rank,
      description,
      image,
      seoTitle,
      seoKeyword,
      seoDescription,
      faq: parsedFaq, // Save faq as part of the app
    });

    await app.save();

    res.redirect("/admin/all-apps");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while adding the app.");
  }
};

// Display All Apps
const AllApps = async (req, res) => {
  try {
    const apps = await App.find();
    res.render("admin-ui/allApps", { apps });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apps.");
  }
};

// Display Edit App Form
const EditAppPage = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await App.findById(id); // Find app by ID
    if (!app) {
      return res.status(404).send("App not found");
    }
    res.render("admin-ui/updateApp", { app });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the app details.");
  }
};

// Handle Edit App Submission
const EditApp = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      rank,
      reviews,
      size,
      downloads,
      downloadUrl,
      seoTitle,
      seoKeyword,
      seoDescription,
      faq, // Include faq in the request body
    } = req.body;

    const image = req.file ? req.file.path : undefined;

    // Validate required fields
    if (!name || !price || !description || !downloadUrl) {
      return res.status(400).send("Missing required fields.");
    }

    // Parse faq if it's a string, otherwise directly use the array
    let parsedFaq = [];
    if (faq) {
      parsedFaq = typeof faq === "string" ? JSON.parse(faq) : faq;
    }

    const updateData = {
      name,
      downloadUrl,
      price,
      rank,
      reviews,
      size,
      downloads,
      description,
      seoTitle,
      seoKeyword,
      seoDescription,
      faq: parsedFaq,
    };

    if (image) updateData.image = image; 

    // Update app in the database
    const app = await App.findByIdAndUpdate(id, updateData, { new: true });

    if (!app) {
      return res.status(404).send("App not found");
    }

    res.redirect("/admin/all-apps");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the app.");
  }
};

// Delete an app
const DeleteApp = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await App.findByIdAndDelete(id);

    if (!app) {
      return res.status(404).send("App not found");
    }

    res.redirect("/admin/all-apps");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the app.");
  }
};

// Helper function for fetching all apps (used in multiple places)
const getAllAppsIndex = async () => {
  try {
    // Fetch all apps
    const apps = await App.find();
    if (!apps || apps.length === 0) {
      throw new Error("No apps found");
    }
    return apps;
  } catch (error) {
    console.error("Error fetching apps:", error);
    throw error;
  }
};

// Export all functions
module.exports = {
  AddAppPage,
  getAllAppsIndex,
  DeleteApp,
  AddApp,
  AllApps,
  EditAppPage,
  EditApp,
};
