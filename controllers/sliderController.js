const Slider = require("../models/sliderModel");
const fs = require("fs");
const path = require("path");

//======================================================================== Add Slider
const addSlider = async (req, res) => {
  if (!req.file) {
    return res.json({ message: "Image upload failed", type: "danger" });
  }

  try {
    const slider = new Slider({
      image: req.file.filename,
    });

    await slider.save();
    res.redirect("/admin/all-sliders");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== Render Add Slider page
const addSliderPage = (req, res) => {
  res.render("admin-ui/addSlider.ejs");
};

//======================================================================== Update Slider controller function
const updateSlider = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  try {
    // Check if a new image is uploaded
    if (req.file) {
      new_image = req.file.filename;
      // Optionally delete the old image from the server
      try {
        fs.unlinkSync(
          path.join(__dirname, "../../uploads", req.body.old_image)
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      new_image = req.body.old_image;
    }

    await Slider.findByIdAndUpdate(id, {
      image: new_image,
    });

    // Set success message in session and redirect
    req.session.message = {
      type: "success",
      message: "Slider updated successfully!",
    };
    res.redirect("/admin/all-sliders");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== Render Update Slider page
const updateSliderPage = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    res.render("admin-ui/updateSlider.ejs", {
      title: "Update Slider",
      slider: slider, // Now includes the correct slider object
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//======================================================================== Delete Slider controller function
const deleteSlider = async (req, res) => {
  try {
    // Find the slider by its ID
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).send("Slider not found");
    }

    // Get the image file path from the slider object
    const imagePath = path.join(__dirname, "../../uploads", slider.image);

    // Delete the image file from the server
    try {
      fs.unlinkSync(imagePath); // Delete the file from the uploads folder
    } catch (err) {
      console.log("Error deleting image:", err);
    }

    // Now delete the slider record from the database
    await Slider.findByIdAndDelete(req.params.id);

    // Set success message and redirect
    req.session.message = {
      type: "success",
      message: "Slider deleted successfully!",
    };
    res.redirect("/admin/all-sliders");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== All Sliders Page controller function
const allSlidersPage = async (req, res) => {
  try {
    const sliders = await Slider.find();

    res.render("admin-ui/allSlider.ejs", {
      sliders: sliders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching sliders.");
  }
};

// ======================================================================== Fetch all sliders for UI
const getAllSliderIndex = async () => {
  try {
    return await Slider.find();
  } catch (err) {
    throw new Error("Error fetching sliders");
  }
};

module.exports = {
  addSliderPage,
  getAllSliderIndex,
  addSlider,
  updateSliderPage,
  updateSlider,
  allSlidersPage,
  deleteSlider,
};
