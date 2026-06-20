import { riskColor } from "@/lib/utils";

interface HeatmapProps {
  data: number[][]; // rows × cols, 0–100
  rows: string[];
  cols: string[];
}

/** Department × week organizational risk heatmap. */
export function Heatmap({ data, rows, cols }: HeatmapProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate" style={{ borderSpacing: 3 }}>
        <thead>
          <tr>
            <th className="w-24" />
            {cols.map((c) => (
              <th key={c} className="pb-1 text-[10px] font-medium uppercase tracking-wider text-ws-text-dim">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row}>
              <td className="pr-2 text-right text-[11px] font-medium text-ws-text-lo">{row}</td>
              {data[ri].map((v, ci) => (
                <td key={ci}>
                  <div
                    className="group relative h-8 rounded-lg"
                    style={{ backgroundColor: riskColor(v), opacity: 0.22 + (v / 100) * 0.78, transition: "background-color 0.4s, opacity 0.4s" }}
                    title={`${row} · ${cols[ci]}: ${v}`}
                  >
                    <span className="tnum absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {v}
                    </span>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
