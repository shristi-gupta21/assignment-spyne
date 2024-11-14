import CarDetailsPage from "@/app/components/CarDetailsPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div>
      <CarDetailsPage id={id} />
    </div>
  );
}
