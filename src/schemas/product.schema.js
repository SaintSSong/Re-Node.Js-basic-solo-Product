import mongoose from "mongoose";
import { PRODUCT_STATUS } from "../constants/product.constatnt.js";

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
      // Object.values란 무엇이냐? ()안의 객체의 value값만 배열로 return을 만들어주는 것
      enum: Object.values(PRODUCT_STATUS),
      default: "FOR_SALE",
    },
  },
  // timestamps이게 뭐냐? mongoose에서 기본으로 제공하는 기능
  // 공식홈페이지 옵션에 가면 있다.
  {
    timestamps: true, // createdAt과 updatedAt을 자동으로 추가
  }
);

export default mongoose.model("ProductSchema", ProductSchema);
