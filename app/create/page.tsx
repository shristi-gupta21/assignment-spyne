import React from "react";
import CarForm from "../components/CarForm";
import Header from "../components/Header";

const page = () => {
  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto">
        <CarForm />
      </div>
    </div>
  );
};

export default page;
