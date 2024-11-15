import CarDetailsPage from "@/app/components/CarDetailsPage";
import Header from "@/app/components/Header";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div>
      <Header />
      <CarDetailsPage id={id} />
    </div>
  );
}
