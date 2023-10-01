import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

/* POST code 추가 */

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
