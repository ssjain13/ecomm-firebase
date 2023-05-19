import bodyParser from "body-parser";
import {
  updateApi,
  fetch,
  save,
  deleteApi,
  getProductCountForCategory,
  getUserProfile,
  deleteProduct,
  getCountByCategory,
  saveCategory,
  deleteCategory,
  deleteUser,
} from "./api.js";

import {
  fetchUserProfile,
  sendVerificationEmail,
  resetPassword,
  deleteAccount,
  accountUpdate,
  fetchUsers,
} from "./userActions.js";
import express from "express";
import cors from "cors";
import { createUser, loginUser, signOutUser } from "./auth.js";
import multer from "multer";
export const app = express();
app.use(bodyParser.json());
app.use(cors());
const upload = multer();

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

app.get("/fetchAllUsers", (req, res) => {
  fetchUsers()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/saveCategory", (req, res) => {
  const data = req.body;
  saveCategory(data, "Categories")
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/saveProduct", upload.single("image"), (req, res) => {
  save(req, "Products")
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
      res.status(200).send({ id: response });
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send({ message: err.message });
    });
});
app.delete("/deleteCategory", (req, res) => {
  const data = req.body.category;

  deleteCategory(data, "Categories")
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
app.delete("/deleteByCategory", (req, res) => {
  deleteProduct(req.body.name)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});
app.get("/getCountByCategory", (req, res) => {
  getCountByCategory()
    .then((productCount) => {
      res.status(200).send(productCount);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/register", (req, res) => {
  const user = req.body;
  createUser(user)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  loginUser(username, password)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

app.get("/signout", (req, res) => {
  signOutUser()
    .then((status) => res.status(200).send({ status }))
    .catch((err) => res.status(500).status(err));
});

app.post("/sendVerificationEmail", (req, res) => {
  sendVerificationEmail(req.body.email)
    .then((status) => res.status(200).send({ status }))
    .catch((err) => res.status(500).status(err));
});

app.get("/getUserProfile", (req, res) => {
  fetchUserProfile(req.body.email)
    .then((user) => res.status(200).send({ user }))
    .catch((err) => res.status(500).status(err));
});

app.post("/resetPassword", (req, res) => {
  resetPassword(req.body.email)
    .then((link) => res.status(200).send({ link }))
    .catch((err) => res.status(500).status(err));
});

app.post("/disableAccount", (req, res) => {
  accountUpdate(req.body.uid, true)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).status(err));
});

app.post("/enableAccount", (req, res) => {
  try {
    accountUpdate(req.body.uid, false).then((resp) =>
      res.status(200).send(resp)
    );
  } catch (err) {
    res.status(500).status(err);
  }
});

app.post("/deleteAccount", (req, res) => {
  deleteAccount(req.body.uid)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).status(err));
});
const PORT = process.env.PORT || 3030;

export const server = app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

function stop() {
  server.close();
}
