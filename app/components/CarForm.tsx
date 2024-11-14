// components/CarForm.tsx
"use client";

import { useState } from "react";

export default function CarForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (images.length > 10) {
      setError("You can only upload up to 10 images.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await fetch("/api/create-car", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage("Car created successfully!");
        setTitle("");
        setDescription("");
        setTags("");
        setImages([]);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create car.");
      }
    } catch (err) {
      setError("An error occurred while creating the car.");
    }
  };

  return (
    <div>
      <h2>Create a New Car</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div>
          <label>Images (up to 10)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files || []))}
          />
        </div>

        <button type="submit">Create Car</button>
      </form>
    </div>
  );
}
