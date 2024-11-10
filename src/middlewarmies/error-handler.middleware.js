export default function (err, req, res, next) {
  console.error(err);

  // err.name이 validationError이면 아래의 문구가 나가도록 설정
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({
    status: 500,
    message: "예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요",
  });
}
