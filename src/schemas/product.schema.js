import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // 필수 여부
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    manager: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    status: {
      type: String,
      required: true,
      default: "FOR_SALE",
    },
    createdAt: {
      type: Date,
      required: false,
    },
    updatedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true, // createdAt과 updatedAt을 자동으로 추가
  }
);

export default mongoose.model("ProductSchema", ProductSchema);
