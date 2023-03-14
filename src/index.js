import bodyParser from "body-parser";
import {
  updateApi,
  fetch,
  save,
  deleteApi,
  getProductCountForCategory,
} from "./api.js";
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
  fetch("Categories")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/fetchProducts", (req, res) => {
  fetch("Products")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/saveCategory", (req, res) => {
  const data = req.body;
  save(data, "Categories")
    .then((result) => {
      res.status(200).send(result );
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/saveProduct", (req, res) => {
  const data = req.body;
  save(data, "Products")
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.delete("/deleteProduct", (req, res) => {
  const data = req.body;
  deleteApi(data, "Products")
    .then((response) => {
      if (response) {
        res.status(200).send(data);
      } else {
        res.status(404).send({ message: "Product not found" });
      }
    })
    .catch((err) => {
      console.error(err);
    });
});
app.delete("/deleteCategory", (req, res) => {
  const data = req.body;
  deleteApi(data, "Categories")
    .then((response) => {
      if (response) {
        res.status(200).send(data);
      } else {
        res.status(404).send({ message: "Category not found" });
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

app.put("/updateProduct", (req, res) => {
  updateApi(req.body, "Products").then((response) => {
    if (response) {
      res.status(200).send(response);
    } else {
      res.status(404).send(response);
    }
  });
});

app.put("/updateCategory", (req, res) => {
  updateApi(req.body, "Categories").then((response) => {
    if (response) {
      res.status(200).send(response);
    } else {
      res.status(404).send(response);
    }
  });
});

app.get("/getCountByCategory", (req, res) => {
  console.log(req.query.category);
  getProductCountForCategory(req.query.category).then((productCount) => {
    res.status(200).send({ productCount, category: req.query.category });
  });
});
app.listen(9000, () => {
  console.log("listening on 9000");
});
