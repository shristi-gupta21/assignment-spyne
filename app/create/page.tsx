import React from "react";
import CarForm from "../components/CarForm";
import Header from "../components/Header";

const page = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Header />
      <CarForm />
    </div>
  );
};

export default page;
