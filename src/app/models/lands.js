import mongoose, { Schema } from "mongoose";

const landSchema = new Schema({
  land: String,
  trees: Array,
  treesTimestamp: Array,
  updatedAt: Date,
  door: String,
  guild: String,
});

const Land = mongoose.models.Land || mongoose.model("Land", landSchema);

export default Land;