import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import noImage from "../images/no-image.png";
import Table, { Columns } from "../components/Table";
import ProductForm from "../components/ProductForm";
import { Product } from "../types/product";
import { User } from "../types/user";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  // const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [initialProducts, setInitialProducts] = useState<Product>();
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();
  const [searchInput, setSearchInput] = useState<string>("");

  const isSuperAdmin = currentUser?.roles === "super admin";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      fetch("http://localhost:8000/api/users/me", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => setCurrentUser(data))
        .catch((error) => {
          alert(error.message);
        });
    }

    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(storedItems);
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Brand",
      dataIndex: "brand",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Image",
      dataIndex: "thumbnail",
      render: (_column: Columns, row: any) => (
        <img
          src={row.thumbnail ? row.thumbnail : noImage}
          alt="product-img"
          style={{ width: "100px" }}
        />
      ),
    },
    {
      title: "Discount",
      dataIndex: "discountPercentage",
    },
    {
      title: "Rating",
      dataIndex: "rating",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_column: Columns, row: any) => (
        <div>
          {isLoggedIn && (
            <div>
              <button onClick={() => handleCreateProduct()}>
                Create product
              </button>
              <button onClick={() => handleUpdateProduct(row)}>
                Update product
              </button>
            </div>
          )}
          <button onClick={() => addToCart(row)}>Add to cart</button>
        </div>
      ),
    },
  ];

  const handleCreateProduct = () => {
    if (!currentUser?.permissions.includes("product.create")) {
      alert("You are not allowed to perform this action");
      return;
    }
    setShowProductForm(true);
  };

  const handleUpdateProduct = (row: any) => {
    if (!currentUser?.permissions.includes("product.update")) {
      alert("You are not allowed to perform this action");
      return;
    }

    setInitialProducts(row);
    setShowProductForm(true);
  };

  const handleClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const addToCart = (product: Product) => {
    if (!isLoggedIn) {
      alert("Please login to add products to cart");
      return;
    }
    const updatedCartItems = [...cartItems, product];
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  const removeFromCart = (index: number) => {
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  const handleCheckout = () => {
    const cart = localStorage.getItem("cartItems");

    if (!cart || cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    fetch("http://localhost:8000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: cart,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "success") {
          localStorage.removeItem("cartItems");
          setCartItems([]);
          alert("Checkout successful");
        } else {
          alert("Checkout failed");
        }
      });
  };

  const handleRedirectToSuperAdminPage = () => {
    navigate("/super-admin");
  };

  const handleProductSubmit = (updatedProduct: Product) => {
    if (initialProducts) {
      const updatedProducts = products.map((product: any) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
      setProducts(updatedProducts);
    } else {
      setProducts([updatedProduct, ...products]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const includedProperties = ["title", "id", "price", "brand", "category"];

  const filteredProducts = products.filter((product) =>
    includedProperties
      .map((key) => product[key])
      .join(" ")
      .toLowerCase()
      .includes(searchInput.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      {isLoggedIn && (
        <div className="cart-list">
          <h2>Cart</h2>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                <div>{item.title}</div>
                <div>Price: ${item.price}</div>
                <button onClick={() => removeFromCart(index)}>Remove</button>
              </li>
            ))}
            {cartItems.length > 0 && (
              <li>
                <strong>Total:</strong> $
                {cartItems.reduce((total, item) => total + item.price, 0)}
              </li>
            )}
          </ul>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      )}

      <h1>Products table</h1>
      {isLoggedIn ? (
        <>
          <h2>Welcome!</h2>
          <button
            onClick={handleLogout}
            style={{ marginRight: "10px", marginBottom: "10px" }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <h2>Login to add/edit/purchase products</h2>
          <button
            onClick={handleClick}
            style={{ marginRight: "10px", marginBottom: "10px" }}
          >
            Login
          </button>
        </>
      )}
      {isSuperAdmin && (
        <button
          onClick={handleRedirectToSuperAdminPage}
          style={{ marginRight: "10px", marginBottom: "10px" }}
        >
          Super admin
        </button>
      )}
      <SearchBar searchInput={searchInput} onChange={handleSearchChange} />
      {showProductForm && (
        <ProductForm
          onSubmit={handleProductSubmit}
          onCancel={() => setShowProductForm(false)}
          initialProduct={initialProducts}
        />
      )}

      <Table columns={columns} data={filteredProducts} />
    </div>
  );
}
