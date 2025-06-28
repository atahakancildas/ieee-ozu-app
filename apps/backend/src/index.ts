import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// TODO: Add security middlewares after development process
// app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello from Express backend!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
