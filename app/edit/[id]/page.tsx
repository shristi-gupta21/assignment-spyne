import EditForm from "@/app/components/EditForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div>
      <EditForm id={id} />
    </div>
  );
}
