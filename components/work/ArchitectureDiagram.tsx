import type { ArchStage, Project } from "@/content/projects";
import { cn } from "@/lib/utils";

function Node({ stage, index, accent }: { stage: ArchStage; index?: number; accent?: boolean }) {
  return (
    <div
      className={cn(
        "bg-bg/80 relative min-w-0 rounded-xl border px-3.5 py-3 backdrop-blur-sm",
        accent ? "border-accent/60" : "border-line-strong",
      )}
    >
      {index !== undefined && (
        <span className="label text-accent block text-[0.6rem]">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <span className="text-fg block text-[0.92rem] leading-snug">{stage.label}</span>
      {stage.detail && (
        <span className="label text-muted mt-1 block text-[0.6rem] tracking-normal normal-case">
          {stage.detail}
        </span>
      )}
    </div>
  );
}

/**
 * Data-flow diagram. Desktop: the main pipeline runs left → right on one row and a side branch
 * hangs beneath its source stage. Mobile: everything runs top → bottom.
 */
export function ArchitectureDiagram({ architecture }: { architecture: Project["architecture"] }) {
  const { main, branch } = architecture;
  const cols = { gridTemplateColumns: `repeat(${main.length}, minmax(0, 1fr))` };

  return (
    <figure
      className="border-line bg-surface/60 rounded-2xl border p-5 md:p-8"
      aria-label="Architecture diagram"
    >
      {/* Desktop */}
      <div className="hidden gap-x-6 md:grid" style={cols}>
        {main.map((stage, i) => (
          <div
            key={stage.label}
            className="relative flex items-center"
            style={{ gridColumn: i + 1, gridRow: 1 }}
            data-reveal
          >
            <div className="w-full">
              <Node stage={stage} index={i} accent={i === main.length - 1} />
            </div>
            {i < main.length - 1 && (
              <span aria-hidden className="flow-line absolute top-1/2 left-full block h-px w-6" />
            )}
          </div>
        ))}
        {branch && (
          <div
            className="flex flex-col items-stretch"
            style={{ gridColumn: branch.from + 1, gridRow: 2 }}
            data-reveal
          >
            <span aria-hidden className="flow-v mx-auto block h-6 w-px" />
            <div className="flex flex-col gap-0">
              {branch.stages.map((b, j) => (
                <div key={b.label} className="flex flex-col">
                  {j > 0 && <span aria-hidden className="flow-v mx-auto block h-4 w-px" />}
                  <Node stage={b} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile */}
      <ol className="flex flex-col md:hidden">
        {main.map((stage, i) => (
          <li key={stage.label} className="flex flex-col">
            <Node stage={stage} index={i} accent={i === main.length - 1} />
            {branch && branch.from === i && (
              <div className="border-accent/50 mt-2 ml-6 flex flex-col gap-2 border-l border-dashed pl-4">
                {branch.stages.map((b) => (
                  <Node key={b.label} stage={b} />
                ))}
              </div>
            )}
            {i < main.length - 1 && <span aria-hidden className="flow-v mx-auto block h-6 w-px" />}
          </li>
        ))}
      </ol>

      <figcaption className="label text-muted mt-5 text-[0.6rem]">
        Data flow · {main.map((s) => s.label).join(" → ")}
      </figcaption>
    </figure>
  );
}
