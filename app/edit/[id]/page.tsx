import EditForm from "@/app/components/EditForm";
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
      <EditForm id={id} />
    </div>
  );
}
