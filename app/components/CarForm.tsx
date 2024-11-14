"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CarForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
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
        setTimeout(() => {
          router.push("/");
        }, 200);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create car.");
      }
    } catch (err) {
      setError("An error occurred while creating the car.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create a New Car </h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 placeholder:text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="mt-1 block placeholder:text-sm w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
              className="mt-1 placeholder:text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="images"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload images</span>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        setImages(Array.from(e.target.files || []))
                      }
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

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
              Create Car
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
