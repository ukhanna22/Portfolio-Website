import { beyond } from "@/content/beyond";
import { isTodo, SHOW_TODOS } from "@/content/todo";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Text } from "@/components/ui/Todo";
import { Book, Robot, Spark, Speech } from "@/components/ui/icons";

const icons = { robot: Robot, book: Book, speech: Speech, spark: Spark } as const;

export function Beyond() {
  const items = beyond.filter((b) => SHOW_TODOS || !isTodo(b.line));
  return (
    <section
      id="beyond"
      data-field="clusters"
      aria-labelledby="beyond-title"
      className="relative py-20 md:py-28"
    >
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel id="beyond" />
            <h2 id="beyond-title" className="font-display text-display-md mt-6" data-reveal>
              Beyond the code
            </h2>
          </div>
        </div>
        <ul
          className={`border-line bg-line mt-10 grid gap-px overflow-hidden rounded-2xl border ${items.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}
        >
          {items.map((b, i) => {
            const Icon = icons[b.icon];
            return (
              <li
                key={i}
                className="bg-bg flex flex-col gap-6 p-6"
                data-reveal
                style={{ "--reveal-delay": `${i * 0.06}s` } as React.CSSProperties}
              >
                <span className="border-line text-accent grid size-10 place-items-center rounded-full border">
                  <Icon width={18} height={18} />
                </span>
                <Text as="p" className="text-muted leading-relaxed">
                  {b.line}
                </Text>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
