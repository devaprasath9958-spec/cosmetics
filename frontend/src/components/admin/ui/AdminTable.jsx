export default function AdminTable({ columns, data, emptyMessage = "No records found." }) {
  if (!data.length) {
    return (
      <div className="rounded-2xl border border-dashed border-obsidian-border bg-obsidian-light/20 py-16 text-center text-sm text-smoke">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-obsidian-border bg-obsidian-light/40">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-obsidian-border bg-obsidian-soft/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-smoke/80"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id ?? idx}
                className="border-b border-obsidian-border/50 last:border-0 hover:bg-obsidian-soft/30 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 text-smoke align-middle">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
