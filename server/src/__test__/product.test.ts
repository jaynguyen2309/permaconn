import request from "supertest";
import { app, server } from "../index";
import { AppDataSource } from "../data-source";

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
  server.close();
  await AppDataSource.destroy();
});

describe("GET /api/products", () => {
  it("should return all products", async () => {
    return request(app)
      .get("/api/products")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});

describe("POST /api/products", () => {
  it("should create a new product", async () => {
    const newProductData = {
      id: 200,
      title: "New Product",
      price: 50,
      brand: "Brand",
      category: "Category",
      description: "Description",
      thumbnail: "thumbnail.jpg",
      discountPercentage: 10,
      rating: 4.5,
    };

    return request(app)
      .post("/api/products")
      .set("Authorization", process.env.TEST_TOKEN as string)
      .send(newProductData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body.title).toBe(newProductData.title);
      });
  });
});

describe("PUT /api/products/:id", () => {
  it("should update the product with id 1", async () => {
    const updateProductData = {
      title: "Iphone 100",
    };

    return request(app)
      .put("/api/products/100")
      .set("Authorization", process.env.TEST_TOKEN as string)
      .send(updateProductData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body.title).toBe(updateProductData.title);
      });
  });
});

// describe("DELETE /api/products/200", () => {
//   it("should delete a product with id 200", async () => {
//     return request(app)
//       .delete("/api/products/200")
//       .set(
//         "Authorization",
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGVzIjoic3VwZXIgYWRtaW4iLCJwZXJtaXNzaW9ucyI6WyJwcm9kdWN0LmNyZWF0ZSIsInByb2R1Y3QudXBkYXRlIl0sImlhdCI6MTcwOTg2ODcxMSwiZXhwIjoxNzA5OTU1MTExfQ.QgMZcNuL8q2Zq4ZE_Mbuk-Pi8rRuRdHIrnMU0xt9NYw"
//       )
//       .expect("Content-Type", /json/)
//       .expect(200);
//   });
// });
