import bodyParser from "body-parser";
import { createCategoryApi, fetchCategoriesApi } from "./api.js";
import express from "express";
import cors from "cors";
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Welcome to Fashionesta-API</h1>");
  res.end();
});

app.get("/fetchCategories", (req, res) => {
  fetchCategoriesApi()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/saveCategory", (req, res) => {
  const data = req.body;
  createCategoryApi(data)
    .then((result) => {
      res.status(200).send({ id: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(9000, () => {
  console.log("listening on 9000");
});
