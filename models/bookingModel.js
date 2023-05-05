const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    additionalInfo: {
      type: String,
    },
    confirmationToken: {
      type: String,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    requests: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

BookingSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 86400, partialFilterExpression: { isConfirmed: false } }
);
const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
