const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const app = express();
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
//MiddleWare
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

//Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);

app.get("/", (req, res) => {
  res.send("Home Page....");
});

//Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
