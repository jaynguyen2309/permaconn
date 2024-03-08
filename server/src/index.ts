import { authenticateToken } from "./middleware/auth-middleware";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import axios from "axios";
import jwt from "jsonwebtoken";
import cors from "cors";
import { Products } from "./entity/products.entity";
import { Users } from "./entity/users.entity";
import { checkSuperAdminRole } from "./middleware/check-superadmin-middleware";
import { SoldItems } from "./entity/sold-items.entity";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

export interface AuthenticatedRequest extends Request {
  decodedUser?: any;
}

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Users API
app.get(
  "/api/users",
  authenticateToken,
  checkSuperAdminRole,
  async (req: Request, res: Response) => {
    try {
      const users = await AppDataSource.getRepository(Users).find({
        where: { roles: "user" },
      });
      res.send(users.reverse());
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.post("/api/users", async (req: Request, res: Response) => {
  try {
    const newUser = await AppDataSource.getRepository(Users).save(req.body);
    res.send(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await AppDataSource.getRepository(Users).findOne({
    where: { email },
  });

  if (!existingUser || existingUser.password !== password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      email: existingUser.email,
      roles: existingUser.roles,
      permissions: existingUser.permissions,
    },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
  );

  res.json({ token });
});

app.put(
  "/api/users/permissions/:id",
  authenticateToken,
  checkSuperAdminRole,
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.id as unknown as number;
      const permissions = req.body.permissions;

      const user = await AppDataSource.getRepository(Users).findOne({
        where: { id: userId },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.permissions = permissions;
      const updatedUser = await AppDataSource.getRepository(Users).save(user);

      res.send(updatedUser);
    } catch (error) {
      console.error("Error updating user permissions:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.get(
  "/api/users/me",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const authenticatedUser = req.decodedUser;
    const user = await AppDataSource.getRepository(Users).findOne({
      where: { email: authenticatedUser.email },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
);

// Products API
app.get("/api/products", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const productsCount = await AppDataSource.getRepository(Products).count();

    if (productsCount > 0) {
      const products = await AppDataSource.getRepository(Products).find({
        order: { createdAt: "DESC" },
      });
      res.json(products);
    } else {
      const dummyProducts = await axios.get(
        "https://dummyjson.com/products?limit=0"
      );
      const productsData = dummyProducts.data;

      for (const productData of productsData.products) {
        const existingProduct = await AppDataSource.getRepository(
          Products
        ).findOne({ where: { id: productData.id } });

        if (!existingProduct) {
          const newProduct = new Products();
          newProduct.id = productData.id;
          newProduct.title = productData.title;
          newProduct.price = productData.price;
          newProduct.brand = productData.brand;
          newProduct.category = productData.category;
          newProduct.description = productData.description;
          newProduct.thumbnail = productData.thumbnail;
          newProduct.discountPercentage = productData.discountPercentage;
          newProduct.rating = productData.rating;

          await AppDataSource.getRepository(Products).save(newProduct);
        }
      }

      const products = await AppDataSource.getRepository(Products).find();
      res.json(products);
    }
  } catch (error) {
    console.error("Error fetching or inserting products:", error);
  }
});

app.post(
  "/api/products",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.decodedUser;
      if (!user.permissions || !user.permissions.includes("product.create")) {
        return res.status(403).json({ message: "Permission denied" });
      }

      const newProduct = await AppDataSource.getRepository(Products).save(
        req.body
      );
      res.send(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  "/api/products/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const product = await AppDataSource.getRepository(Products).findOneBy({
        id: req.params.id as unknown as number,
      });

      if (product) {
        const updatedProduct = await AppDataSource.getRepository(Products).save(
          AppDataSource.getRepository(Products).merge(product, req.body)
        );
        res.send(updatedProduct);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.delete(
  "/api/products/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const product = await AppDataSource.getRepository(Products).findOneBy({
        id: req.params.id as unknown as number,
      });

      if (product) {
        await AppDataSource.getRepository(Products).remove(product);
        res.send(product);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Checkout
app.post(
  "/api/checkout",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const authenticatedUser = req.decodedUser;

      const user = await AppDataSource.getRepository(Users).findOne({
        where: { email: authenticatedUser.email },
      });

      const cart = req.body;

      const total = cart.reduce((acc: number, item: any) => {
        return acc + item.price;
      }, 0);

      const soldItems = new SoldItems();

      if (user) {
        soldItems.purchasedUser = user;
        soldItems.total = total;
        soldItems.products = cart.map((item: any) => item.title);
      }

      const newSoldItems = await AppDataSource.getRepository(SoldItems).save(
        soldItems
      );

      res.send({ message: "success", newSoldItems });
    } catch (error) {
      console.error("Error checking out:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));

const server = app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});

export { server, app };
