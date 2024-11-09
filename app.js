import express from "express";
import productMongoose from "./src/schemas";

const app = express();
const PORT = 3000;

// mongoose DB와 연결
productMongoose();

// req.body로 받은 데이터를 서버가 읽게해주기 위해서 쓰는 코드
app.use(express.json());

// 프론트랑 연결할 때 필요한 코드 백엔드에서는 사용하지 않지만 필요한 녀석
app.use(express.urlencoded({ extended: true }));

// 라우터를 통해서 각 API에 연결될 녀석들
const router = express.Router();

// 라우터는 응답한다 Hi라고
router.get("/", (req, res) => {
  return res.json({ message: "Hi" });
});

// 주소창에 /api가 적혀있는 순가 router로 연결될거고 연결을 확인하는 순간에는 16번 코드가 작동할 것이다.
app.use("/api", router);

app.listen(PORT, () => {
  console.log(PORT, "포드 번호로 서버가 연결 되었습니다.");
});
