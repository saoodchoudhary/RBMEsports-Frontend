// components/ui/Table.js
"use client";

export default function Table({ columns, rows, loading = false }) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="animate-pulse">
          <div className="h-12 bg-slate-100"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 border-t border-slate-200">
              <div className="h-full bg-slate-50"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <div className="text-slate-400 mb-2">📊</div>
        <div className="text-slate-600">No data available</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((c) => (
                <th 
                  key={c.key} 
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
                >
                  {c.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((r, idx) => (
              <tr 
                key={r.id || idx} 
                className="hover:bg-slate-50 transition-colors duration-150"
              >
                {columns.map((c) => (
                  <td 
                    key={c.key} 
                    className="px-6 py-4 whitespace-nowrap text-sm text-slate-800"
                  >
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div>
            Showing <span className="font-semibold">{rows.length}</span> tournaments
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-md border border-slate-300 hover:bg-white">
              Previous
            </button>
            <span className="px-2">Page 1 of 1</span>
            <button className="px-3 py-1 rounded-md border border-slate-300 hover:bg-white">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}