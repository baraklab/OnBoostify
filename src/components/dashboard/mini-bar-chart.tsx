export function MiniBarChart({ data, label }: { data: number[]; label: string }) {
  const max = Math.max(1, ...data);

  return (
    <div>
      <p className="text-eyebrow mb-3">{label}</p>
      <div className="flex h-24 items-end gap-1.5">
        {data.map((value, index) => (
          <div
            key={index}
            className="flex-1 rounded-sm bg-accent/70"
            style={{ height: `${Math.max(4, (value / max) * 100)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
