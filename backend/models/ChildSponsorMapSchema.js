const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChildSponsorMapSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    donations: [
      {
        donationId: {
          type: Schema.Types.ObjectId,
          ref: "Donation",
          required: true,
          index: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        numChild: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: "child_sponsor_maps",
  }
);

module.exports = mongoose.model("ChildSponsorMap", ChildSponsorMapSchema);
