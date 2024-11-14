"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Fuel, Gauge, Users } from "lucide-react";

interface Car {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
}

export default function CarDetailsPage({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 uppercase">{car && car.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 ">
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

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
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
          <div className="bg-white rounded-lg shadow p-6">
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
