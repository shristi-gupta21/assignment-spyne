"use client";

import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Car {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
}

export default function EditForm({ id }: { id: string }) {
  const [car, setCar] = useState<Car | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]); // For newly uploaded images
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const response = await fetch("/api/get-car", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch car details");
      }

      const data = await response.json();
      setCar(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Merge existing images with new images
    const totalImages = (car?.images?.length || 0) + newImages.length;
    if (totalImages > 10) {
      setError("You can upload a maximum of 10 images.");
      return;
    }

    const updatedImages = [
      ...(car?.images || []), // Keep existing images
      ...newImages.map((image) => URL.createObjectURL(image)), // Add new images
    ];

    const data = {
      id: car?.id || "",
      title: car?.title || "",
      description: car?.description || "",
      tags: car?.tags || [],
      images: updatedImages, // Use merged images
    };

    try {
      const response = await fetch("/api/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccessMessage("Car updated successfully!");
        setTimeout(() => {
          router.push("/");
        }, 200);
      } else {
        const responseData = await response.json();
        setError(responseData.message || "Failed to update car.");
      }
    } catch (err) {
      setError("An error occurred while updating the car.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCar((prevCar) => (prevCar ? { ...prevCar, [name]: value } : null));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = (car?.images?.length || 0) + files.length;

    if (totalImages > 10) {
      setError("You can upload a maximum of 10 images.");
      return;
    }

    setNewImages(files);
  };

  const removeImage = (imageUrl: string) => {
    setCar((prevCar) =>
      prevCar
        ? {
            ...prevCar,
            images: prevCar.images.filter((img) => img !== imageUrl),
          }
        : null
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Car</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700"
            >
              Car Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={car?.title || ""}
              onChange={handleInputChange}
              required
              className="mt-1 px-2 py-1 placeholder:text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              placeholder="e.g. Tesla Model S"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={car?.description || ""}
              onChange={handleInputChange}
              rows={4}
              required
              className="mt-1 px-2 py-1  block placeholder:text-sm w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              placeholder="Provide a detailed description of the car..."
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-semibold text-gray-700"
            >
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={
                Array.isArray(car?.tags) ? car.tags.join(", ") : car?.tags || ""
              }
              onChange={handleInputChange}
              required
              className="mt-1 px-2 py-1 placeholder:text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              placeholder="e.g. electric, SUV, automatic, etc"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Existing Images
            </label>
            <div className="flex gap-4 flex-wrap">
              {car?.images.map((image, index) => (
                <div key={index} className="relative w-40 h-28">
                  <img
                    src={image}
                    alt={`Existing image ${index + 1}`}
                    className="w-40 h-28 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="absolute -top-3.5 -right-1 text-xl text-black flex shrink-0"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add New Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="new-images"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black"
                  >
                    <span>Upload new images</span>
                    <input
                      id="new-images"
                      name="new-images"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
              </div>
            </div>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

          <div className="flex justify-end gap-4">
            <Link href={"/"}>
              <button
                type="button"
                className="px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-black border-black hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Back
              </button>
            </Link>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-black hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
