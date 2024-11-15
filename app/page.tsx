import CarList from "./components/Cars";
import Header from "./components/Header";
export default function Home() {
  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto">
        <CarList />
      </div>
    </div>
  );
}
