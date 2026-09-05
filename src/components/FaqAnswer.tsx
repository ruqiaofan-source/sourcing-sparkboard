type Block = { type: "p"; lines: string[] } | { type: "ol"; items: { title: string; lines: string[] }[] };

function parseAnswer(answer: string): Block[] {
  const paragraphs = answer.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const blocks: Block[] = [];
  for (const para of paragraphs) {
    const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
    const match = /^(\d+)\.\s+(.*)$/.exec(lines[0] ?? "");
    if (match) {
      const item = { title: match[2], lines: lines.slice(1) };
      const last = blocks[blocks.length - 1];
      if (last && last.type === "ol") last.items.push(item);
      else blocks.push({ type: "ol", items: [item] });
    } else {
      blocks.push({ type: "p", lines });
    }
  }
  return blocks;
}

/** Renders a FAQ answer string, turning numbered paragraphs into an ordered list. */
export function AnswerBody({ answer }: { answer: string }) {
  const blocks = parseAnswer(answer);
  return (
    <div className="space-y-3 text-sm leading-relaxed text-body-ink">
      {blocks.map((block, i) =>
        block.type === "ol" ? (
          <ol key={i} className="list-decimal space-y-2 pl-5">
            {block.items.map((item, j) => (
              <li key={j}>
                <span className="font-medium text-primary">{item.title}</span>
                {item.lines.map((line, k) => (
                  <span key={k} className="block">
                    {line}
                  </span>
                ))}
              </li>
            ))}
          </ol>
        ) : (
          <p key={i}>
            {block.lines.map((line, k) => (
              <span key={k} className="block">
                {line}
              </span>
            ))}
          </p>
        ),
      )}
    </div>
  );
}

export default AnswerBody;
