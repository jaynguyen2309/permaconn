import React, { useState, useEffect } from "react";
import "../css/ProductForm.css";

interface ProductFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialProduct?: any;
}

export default function ProductForm({
  onSubmit,
  onCancel,
  initialProduct,
}: ProductFormProps) {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [brand, setBrand] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    if (initialProduct) {
      setTitle(initialProduct.title);
      setPrice(initialProduct.price);
      setBrand(initialProduct.brand);
      setDescription(initialProduct.description);
      setCategory(initialProduct.category);
      setDiscount(initialProduct.discountPercentage);
      setRating(initialProduct.rating);
    }
  }, [initialProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = initialProduct ? "PUT" : "POST";
      const url = initialProduct
        ? `http://localhost:8000/api/products/${initialProduct.id}`
        : "http://localhost:8000/api/products";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          price,
          brand,
          description,
          category,
          discountPercentage: discount,
          rating,
        }),
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        onSubmit(updatedProduct);
        alert("Product saved successfully");
      } else {
        console.error("Failed to save product:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <div className="product-form">
      <div className="modal-content">
        <span className="close" onClick={onCancel}>
          &times;
        </span>
        <h2>{initialProduct ? "Update" : "Create New"} Product</h2>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
          />
          <label>Brand:</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <label>Discount:</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value))}
            required
          />
          <label>Rating:</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
            required
          />
          <button type="submit">{initialProduct ? "Update" : "Create"}</button>
        </form>
      </div>
    </div>
  );
}
