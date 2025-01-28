const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");

//======================================================================== Render Signup Page
const renderSignUp = (req, res) => {
  res.render("admin-ui/signup.ejs", { title: "Admin Signup", error: null });
};

//======================================================================== Handle Signup
const handleSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.render("admin-ui/signup.ejs", {
        title: "Admin Signup",
        error: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();
    res.redirect("/admin/login");
  } catch (error) {
    console.error(error);
    res.render("admin-ui/signUp.ejs", {
      title: "Admin Signup",
      error: "Something went wrong",
    });
  }
};

//======================================================================== Render Login Page
const renderLogin = (req, res) => {
  res.render("admin-ui/login.ejs", { title: "Admin Login", error: null });
};

//======================================================================== Handle Login
const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.render("admin-ui/login.ejs", {
        title: "Admin Login",
        error: "Invalid email or password",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.render("admin-ui/login.ejs", {
        title: "Admin Login",
        error: "Invalid email or password",
      });
    }

    // Set session data
    req.session.admin = { id: admin._id, name: admin.name };

    // Set a persistent cookie for login
    res.cookie("adminSession", admin._id, {
      httpOnly: true, // Prevent client-side access to cookie
      secure: false, // Set to true in production with HTTPS
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.render("admin-ui/login.ejs", {
      title: "Admin Login",
      error: "Something went wrong",
    });
  }
};

//======================================================================== Middleware to Check Login Status
const checkAdminAuth = async (req, res, next) => {
  if (req.session.admin) {
    return next(); // If session exists, proceed
  }

  const adminSession = req.cookies.adminSession; // Retrieve the cookie
  if (!adminSession) {
    return res.redirect("/admin/login"); // Redirect if no session or cookie
  }

  try {
    const admin = await Admin.findById(adminSession);
    if (admin) {
      req.session.admin = { id: admin._id, name: admin.name };
      return next(); // Proceed if admin is found
    } else {
      res.clearCookie("adminSession"); // Clear invalid cookie
      return res.redirect("/admin/login");
    }
  } catch (error) {
    console.error("Error during admin authentication:", error);
    res.redirect("/admin/login");
  }
};

//======================================================================== Render Dashboard Page
const renderDashboard = (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  res.render("admin-ui/index.ejs", {
    title: "Admin Dashboard",
    admin: req.session.admin,
  });
};

//======================================================================== Render Update Password Page
const renderUpdate = (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  res.render("admin-ui/update.ejs", { title: "Update Password", error: null });
};

//======================================================================== Handle Update Password
const handleUpdatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const admin = await Admin.findById(req.session.admin.id);
    if (!admin) {
      return res.redirect("/admin/login");
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isPasswordValid) {
      return res.render("admin-ui/update.ejs", {
        title: "Update Password",
        error: "Current password is incorrect",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.render("admin-ui/update.ejs", {
      title: "Update Password",
      error: "Something went wrong",
    });
  }
};

//======================================================================== Handle Logout
const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during session destruction:", err);
      return res.status(500).send("Failed to logout.");
    }
    res.clearCookie("adminSession"); // Clear the cookie
    res.redirect("/admin/login");
    console.log("Admin successfully logged out.");
  });
};

//======================================================================== Exporting all functions
module.exports = {
  renderSignUp,
  handleSignUp,
  renderLogin,
  handleLogin,
  renderDashboard,
  renderUpdate,
  handleUpdatePassword,
  handleLogout,
  checkAdminAuth,
};
