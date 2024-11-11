import Joi from "joi";
import { PRODUCT_STATUS } from "../../constants/product.constatnt.js";

export const updateProductValidator = async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      name: Joi.string().messages({
        // 여기서 string.base / any.required 는 Joi에서 제공하는 데이터이다.
        "string.base": "상품명은 문자열이여야 합니다.",
      }),
      description: Joi.string().messages({
        "string.base": "상품설명은 문자열이여야 합니다.",
      }),
      manager: Joi.string().messages({
        "string.base": "담당자는 문자열이여야 합니다.",
      }),
      password: Joi.string().required().messages({
        "string.base": "비밀번호는 문자열이여야 합니다.",
        "any.required": "비밀번호를 입력해 주세요.",
      }),
      // .valid()란 옵션 값인데 ()안에 넣은 값만 넣어야지 가능하다
      // Object.values(PRODUCT_STATUS)는 Object.values란 무엇이냐? ()안의 객체의 value값만 배열로 return을 만들어주는 것 (Schema에서 사용했었음)
      // 스프레드 왜 쓰느냐? Object.values(PRODUCT_STATUS)만 쓰면 [] 값으로 나옴. []을 풀어줘야 함. 따라서 쓴 것
      // "any.only"란? .valid()/.allow()를 사용할 때 나올 수 있는 오류인데
      //  Object.values(PRODUCT_STATUS) 속의 내용물 외에 다른 것을 넣을 때 규칙을 지켜야 한다고 나온 것이다.
      status: Joi.string()
        .valid(...Object.values(PRODUCT_STATUS))
        .messages({
          "string.base": "상품상태는 문자열이여야 합니다.",
          "any.only": "상품 상태는 [FOR_SALE,SOLD_OUT] 중 하나여야 합니다.",
        }),
    });

    await joiSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};

// 내가 알아야 할 것!
