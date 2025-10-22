import ReturnContent from "./ReturnContent";

type PageProps = {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function ReturnPage({ params, searchParams }: PageProps) {
  const statusParam = searchParams?.status;
  const orderIdParam = searchParams?.orderId;

  const status =
    Array.isArray(statusParam) ? statusParam[0] ?? "success" : statusParam ?? "success";
  const orderId =
    Array.isArray(orderIdParam) ? orderIdParam[0] ?? "n/a" : orderIdParam ?? "n/a";

  return (
    <ReturnContent
      locale={params.locale}
      status={status}
      orderId={orderId}
    />
  );
}
