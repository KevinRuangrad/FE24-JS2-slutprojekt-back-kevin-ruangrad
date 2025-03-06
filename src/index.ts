import express from "express";
import cors from "cors";
import memeberRouter from "./routers/memberRouter.js";
import taskRouter from "./routers/taskRouter.js";

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());

app.use("/", memeberRouter);
app.use("/", taskRouter);

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
