export default function (err, req, res, next) {
  console.error(err);

  // err.name이 validationError이면 아래의 문구가 나가도록 설정
  if (err.name === "validationError") {
    return res.status(400).json({ message: "상품이 존재하지 않습니다." });
  }

  return;
}
