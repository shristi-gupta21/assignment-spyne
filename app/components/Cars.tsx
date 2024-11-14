"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

const CarList: React.FC = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]); // Array for filtered search results
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchCars() {
      const res = await fetch("/api/cars");
      const data = await res.json();
      setCars(data);
    }
    fetchCars();
  }, []);

  const handleSearch = (query: string) => {
    setQuery(query);
    if (!query) {
      setFilteredCars(cars);
      return;
    }
    const results = cars.filter((car) =>
      car.title.toLowerCase().includes(query.toLowerCase())
    );
    console.log(query, results);

    setFilteredCars(results);
  };
  const handleDelete = async (id: string) => {
    const response = await fetch("/api/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
      console.log("Car deleted successfully");
    } else {
      console.error("Error deleting car");
    }
  };
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Find Your Perfect Car</h1>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Search cars..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.length === 0 && !query
            ? cars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image
                      src={car.images[0]}
                      alt={car.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{car.title}</h2>
                    <Link href={`details/${car.id}`}>
                      <button className="w-full mt-2 bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            : filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image
                      src={car.images[0]}
                      alt={car.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{car.title}</h2>
                    <Link href={`details/${car.id}`}>
                      <button className="w-full bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default CarList;
