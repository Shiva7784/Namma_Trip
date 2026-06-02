const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "traveler" },
    referralCode: { type: String, unique: true, sparse: true },
    completedOnboarding: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
