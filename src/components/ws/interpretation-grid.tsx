import { INTERPRETATION_GRID } from "@/lib/domain/interpretation-grid";

const GREEN = "#4AAA83";
const AMBER = "#E0843C";
const RED = "#E06A5C";

/** Client-provided HR interpretation grid — a piloting reference, not a norm. */
export function InterpretationGrid() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ws-border bg-white">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-ws-cloud text-left text-xs uppercase tracking-wider text-ws-text-dim">
          <tr>
            <th className="px-4 py-3">Indicateur</th>
            <th className="px-4 py-3"><Dot color={GREEN} /> Vert</th>
            <th className="px-4 py-3"><Dot color={AMBER} /> Orange</th>
            <th className="px-4 py-3"><Dot color={RED} /> Rouge</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {INTERPRETATION_GRID.map((r) => (
            <tr key={r.indicator} className="border-t border-ws-border">
              <td className="px-4 py-3 font-medium text-ws-ink">{r.indicator}</td>
              <td className="px-4 py-3 tnum" style={{ color: GREEN }}>{r.green}</td>
              <td className="px-4 py-3 tnum" style={{ color: AMBER }}>{r.amber}</td>
              <td className="px-4 py-3 tnum" style={{ color: RED }}>{r.red}</td>
              <td className="px-4 py-3 text-ws-sage">{r.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: color }} />;
}
