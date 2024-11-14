"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Car {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
}

export default function CarDetailsPage({ id }: { id: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);
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
  const handleDelete = async (id: string) => {
    const response = await fetch("/api/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      router.push("/");
      console.log("Car deleted successfully");
    } else {
      console.error("Error deleting car");
    }
  };
  const nextImage = () => {
    if (car) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + car.images.length) % car.images.length
      );
    }
  };
  if (!car && !error) {
    return <p className="text-center mt-4 font-semibold text-xl">Loading...</p>;
  }
  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-4 uppercase">
          {car && car.title}
        </h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleDelete(id)}
            className="px-4 py-2  h-fit border border-transparent text-sm font-semibold rounded-md text-black border-black hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Delete
          </button>
          <Link href={`/edit/${id}`}>
            <button
              type="button"
              className="px-4 h-fit py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-black hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Edit
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 my-8 w-full">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          {car && (
            <Image
              src={car.images[currentImageIndex]}
              alt={`${car.title} - Image ${currentImageIndex + 1}`}
              layout="fill"
              objectFit="contain"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={prevImage}
              className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {car &&
              car.images.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
          </div>
        </div>

        <div className="w-full  flex gap-4">
          <div className="bg-white w-full rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <div className="flex flex-wrap gap-2">
              {car &&
                car.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
          <div className="bg-white w-full rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <div className="mt-4">
              <p>{car && car.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
