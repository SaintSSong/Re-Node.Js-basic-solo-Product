import express from "express";
import productSchema from "../schemas/product.schema.js";
import { createProductValidator } from "../middlewarmies/validators/create-Product.validator.middlewarmies.js";
import { deleteProductValidator } from "../middlewarmies/validators/delete-Product.validator.middlewarmies.js";
import { updateProductValidator } from "../middlewarmies/validators/update-Product.validator.middlewarmies.js";

// 왜 router를 써야할까?
// URl을 타고 와서 들어와야하기 떄문에 쓰는거다.
const router = express.Router();

/**
 * 1. Joi 설치 후 써보기
 * 2. 에러처리미들웨어 적용해보기
 */

// 상품 생성하기
router.post("/product", createProductValidator, async (req, res, next) => {
  try {
    const { name, description, manager, password } = req.body;

    //2. 상품이 기존에 존재하는지 확인
    const existedProduct = await productSchema.findOne({ name }).exec();

    // 2-1. 있다면 에러처리 "이미 존재하는 상품입니다."
    if (existedProduct) {
      return res
        .status(400)
        .json({ status: 401, message: "이미 존재하는 상품입니다." });
    }

    // 3. 새로운 상품 만들어서 DB에 저장하기
    const newProduct = new productSchema({
      name,
      description,
      manager,
      password,
    });

    let product = await newProduct.save();

    // 4. 상품 보여주기 보여줄 떄 PW는 안보여주기
    product = { ...product.toJSON(), password: undefined };

    // 5. 저장한 것 보여주기
    return res.status(201).json({
      status: 201,
      message: "상품 생성에 성공했습니다.",
      product,
    });
  } catch (error) {
    next(error);
  }
});

// 상품 조회하기
router.get("/product", async (req, res, next) => {
  try {
    const product = await productSchema
      .find()
      .sort({ createdAt: "desc" })
      .exec();

    if (product.length <= 0) {
      return res
        .status(200)
        .json({ status: 200, product, message: "상품이 아무것도 없습니다." });
    }

    return res
      .status(201)
      .json({ product, message: "성공적으로 불러내었습니다." });
  } catch (error) {
    next(error);
  }
});

// 상품 상세조회하기
router.get("/product/:productID", async (req, res, next) => {
  try {
    //   - **상품 ID**를 **Path Parameter(`req.params`)**로 전달 받습니다.
    const { productID } = req.params;

    // - **상품 ID, 상품명, 상품 설명, 담당자, 상품 상태, 생성 일시, 수정 일시** 를 조회합니다.
    const existedProduct = await productSchema.findById(productID).exec();

    // 조회된 상품이 없으면 에러를 뱉어야한다.
    if (!existedProduct) {
      return res.status(400).json({
        status: 400,
        message: "존재하지 않는 상품입니다.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "상품 조회에 성공했습니다.",
      existedProduct,
    });
  } catch (error) {
    next(error);
  }
});

// 상품 수정하기
router.put(
  "/product/:productID",
  updateProductValidator,
  async (req, res, next) => {
    try {
      // - **상품 ID**를 **Path Parameter(`req.params`)**로 전달 받습니다.
      const { productID } = req.params;

      // - **상품명, 상품 설명, 담당자, 상품 상태, 비밀번호**를 **Request body(`req.body`)**로 전달 받습니다.
      const { name, description, manager, password, status } = req.body;

      // - **수정할 상품과 비밀번호 일치 여부를 확인**한 후, 동일할 때만 상품이 **수정**되어야 합니다.
      const rightProduct = await productSchema
        .findById(productID, { password: true })
        .exec();

      if (!rightProduct) {
        return res
          .status(400)
          .json({ status: 400, message: "존재하지 않는 상품입니다." });
      }

      //    일치하지 않을 경우, **“비밀번호가 일치하지 않습니다.”** 메세지를 반환합니다.
      let rightPassword = password === rightProduct.password;

      if (!rightPassword) {
        return res
          .status(400)
          .json({ status: 400, message: "올바르지 않는 비빌번호입니다." });
      }

      // 상품 수정하기
      const updateProduct = {
        name: name,
        description: description,
        manager: manager,
        status: status,
      };

      let newProduct = await productSchema.findByIdAndUpdate(
        productID,
        updateProduct
      );

      return res.status(201).json({
        status: 201,
        message: "상품 수정이 완료되었습니다.",
        newProduct: newProduct,
      });
      next();
    } catch (error) {
      next(error);
    }
  }
);

// 상품 삭제하기
router.delete(
  "/product/:productID",
  deleteProductValidator,
  async (req, res, next) => {
    try {
      //- **상품 ID**를 **Path Parameter(`req.params`)**로 전달 받습니다.
      const { productID } = req.params;

      //- **비밀번호**를 **Request body(`req.body`)**로 전달 받습니다.
      const { password } = req.body;

      // 존재하는 상품인지 조회합니다.
      const existedProduct = await productSchema
        .findById(productID, { password: true })
        .exec();

      // 조회된 상품이 없으면 에러를 뱉어야한다.
      if (!existedProduct) {
        return res.status(400).json({
          status: 400,
          message: "존재하지 않는 상품입니다.",
        });
      }

      //- **삭제할 상품과 비밀번호 일치 여부를 확인**한 후, 동일할 때만 글이 **삭제**되어야 합니다. 일치하지 않을 경우, **“비밀번호가 일치하지 않습니다.”** 메세지를 반환합니다.
      const rightPassword = password === existedProduct.password;

      console.log("password", password);
      console.log("existedProduct.password", existedProduct.password);
      console.log("rightPassword", rightPassword);
      if (!rightPassword) {
        return res
          .status(400)
          .json({ status: 400, message: "비밀번호가 일치하지 않습니다." });
      }

      // 상품이 존재하면 삭제처리
      let Product = await productSchema.findByIdAndDelete(productID).exec();

      return res.status(200).json({
        status: 200,
        message: "상품이 성공적으로 삭제되었습니다.",
        Product,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
