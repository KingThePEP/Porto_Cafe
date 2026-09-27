export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black tracking-[-0.04em] text-[#241c18]">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-[#6d5b50]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
