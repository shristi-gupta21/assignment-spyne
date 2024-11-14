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
        </div>
      ))}
    </div>
  );
};

export default CarList;
