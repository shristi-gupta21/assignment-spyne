"use client";
import React, { useEffect, useState } from "react";

const CarList: React.FC = () => {
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCars() {
      const res = await fetch("/api/cars");
      const data = await res.json();
      setCars(data);
    }
    fetchCars();
  }, []);

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
      <h2>Car Listings</h2>
      {cars.map((car) => (
        <div key={car.id}>
          <h3>title={car.title}</h3>
          <p>description={car.description}</p>
          <div>
            {car.images.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`${car.title} image`}
                width="150"
              />
            ))}
          </div>
          <button onClick={() => handleDelete(car.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default CarList;
