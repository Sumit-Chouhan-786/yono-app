const mongoose = require("mongoose");

const appSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    downloadUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    downloads: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    reviews: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    seoTitle: {
      type: String,
    },
    seoKeyword: {
      type: String,
    },
    seoDescription: {
      type: String,
    },
    faq: [
      {
        heading: {
          type: String,
          required: true,
          trim: true,
        },
        paragraph: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    rank: {
      type: Number, 
      enum: [1, 2, 3], 
      default: null, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("App", appSchema);
