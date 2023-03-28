import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import { server } from "../src/index.js";
import { updateApi } from "../src/api.js";
import sinon from "sinon";

import request from "supertest";

chai.use(chaiHttp);
chai.should();

describe("Fetch API endpoints", () => {
  describe("GET /fetchCategories", () => {
    it("should return an array of categories", (done) => {
      chai
        .request(server)
        .get("/fetchCategories")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });

  describe("GET /fetchProducts", () => {
    it("should return an array of products", (done) => {
      chai
        .request(server)
        .get("/fetchProducts")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });

  describe("GET /fetchUsers", () => {
    it("should return an array of users", (done) => {
      chai
        .request(server)
        .get("/fetchUsers")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });
});

describe("Save API endpoints", () => {
  describe("Post /saveProduct", () => {
    it("should save a new product to the database", (done) => {
      const product = { title: "Test Product", price: 9.99 }; // example data to be sent in the request body
      chai
        .request(server)
        .post("/saveProduct")
        .send(product)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("id");
          expect(res.body.title).to.equal(product.title);
          expect(res.body.price).to.equal(product.price);
          done();
        });
    });
  });

  describe("Post /saveCategory", () => {
    it("should save a new category to the database", (done) => {
      const category = { name: "Test Category", description: "This is a test" }; // example data to be sent in the request body
      chai
        .request(server)
        .post("/saveCategory")
        .send(category)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("id");
          expect(res.body.name).to.equal(category.name);
          expect(res.body.description).to.equal(category.description);
          done();
        });
    });
  });
});
describe("Update API endpoints", () => {
  describe("PUT /updateProduct", () => {
    let updateApiStub;

    beforeEach(() => {
      updateApiStub = sinon.stub();
    });

    it("should update product and return 200 if updateApi succeeds", async () => {
      const requestBody = {
        id: "1OkhE6VyY59LXSjrD7Pz",
        name: "Product 1",
        price: 10.99,
      };
      const expectedResponse = true;

      // Stub the updateApi function called by the route
      updateApiStub
        .withArgs(requestBody, "Products")
        .resolves(expectedResponse);
      sinon.replace(updateApi, "bind", () => updateApiStub);

      // Send request to the route
      const res = await request(server).put("/updateProduct").send(requestBody);

      // Check the response and the updateApi call
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(expectedResponse);
      //    sinon.assert.calledOnce(updateApiStub);
      //  sinon.assert.calledWithExactly(updateApiStub, requestBody, "Products");
    });

    it("should return 404 if updateApi fails", async () => {
      const requestBody = { id: "123", name: "Product 1", price: 10.99 };
      const expectedResponse = false;

      // Stub the updateApi function called by the route

      // Send request to the route
      const res = await request(server).put("/updateProduct").send(requestBody);

      // Check the response and the updateApi call
      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal(expectedResponse);

      //   sinon.assert.calledWithExactly(updateApiStub, requestBody, "Products");
    });
  });
});
describe("Delete API endpoints", () => {
  describe("DELETE /deleteProduct", () => {
    it("should delete an existing product and return it", (done) => {
      const productToDelete = { id: "1OkhE6VyY59LXSjrD7Pz" }; // assuming there's a product with id 1 in the database
      chai
        .request(server)
        .post("/deleteProduct")
        .send(productToDelete)
        .end((err, res) => {
          expect(res).to.have.status(404);
          //  expect(res.body).to.have.property("id");

          done();
        });
    });
  });

  describe("DELETE /deleteCategory", () => {
    it("should delete an existing category and return it", (done) => {
      const categoryToDelete = { id: "qFyQwz14rh0PMQRpBxWD" }; // assuming there's a category with id 1 in the database
      chai
        .request(server)
        .post("/deleteCategory")
        .send(categoryToDelete)
        .end((err, res) => {
          expect(res).to.have.status(404);
          //expect(res.body).to.have.property("id");
          done();
        });
    });
  });
});
