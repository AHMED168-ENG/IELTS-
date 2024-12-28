const mongoose = require("mongoose");

// Define the schema for guideLines
const guideLinesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Optional, can be adjusted as needed
    },
    disability: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Disability model
      ref: "Disability", // The referenced model
      required: true,
    },
    pdf: {
      type: String, // URL or file path for PDF
      required: false, // Optional
    },
    active: {
      type: Boolean,
      default: true, // Defaults to true if not provided
    },
    image: {
      type: String, // URL or file path for image
      required: false, // Optional
    },
    isOther: {
      type: Boolean,
      default: false, // Defaults to false if not provided
    },
    otherDisabilities: [
      {
        type: mongoose.Schema.Types.ObjectId, // Array of references to other disabilities
        ref: "Disability", // The referenced model
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model
const GuideLines = mongoose.model("GuideLines", guideLinesSchema);

module.exports = GuideLines;
