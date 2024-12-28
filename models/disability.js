const mongoose = require("mongoose");

const disabilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Optional, depending on your use case
    },
    description: {
      type: String,
      required: true, // Optional, depending on your use case
    },
    image: {
      type: String, // Assuming this stores a URL or file path to the image
      required: false, // Optional
    },
    active: {
      type: Boolean,
      default: true, // If no value is provided, it will default to true
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model
const Disability = mongoose.model("Disability", disabilitySchema);

module.exports = Disability;
