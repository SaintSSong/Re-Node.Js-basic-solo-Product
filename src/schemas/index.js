import mongoose from "mongoose";

const productMongoose = () => {
  mongoose
    .connect(
      "mongodb+srv://practice_sparta_user:<db_password>@express-mongo.06gd2ya.mongodb.net/?retryWrites=true&w=majority&appName=express-mongo",
      {
        dbName: "solo_Practice_Product",
      }
    )
    .then(() => console.log("MongoDB 연결에 성공하였습니다."))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB 연결 에러", err);
});

export default productMongoose;
