import { JSX } from "react";

interface FormattedTextProps {
  text: string | null | undefined;
  isShort?: boolean;
}

export default function FormattedText({
  text,
  isShort = false,
}: FormattedTextProps) {
  if (!text) return null;

  const processText = (value: string): JSX.Element[] => {
    const lines = value.split("\n");
    const result: JSX.Element[] = [];
    let index = 0;

    while (index < lines.length) {
      const line = lines[index].trim();

      if (line.startsWith("- ")) {
        const listItems: string[] = [];
        while (index < lines.length && lines[index].trim().startsWith("- ")) {
          const item = lines[index].trim().substring(2).trim();
          if (item) listItems.push(item);
          index++;
        }

        result.push(
          <ul key={`list-${result.length}`} className="mb-4 ml-6 list-disc">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        );
        continue;
      }

      result.push(
        <p key={`p-${result.length}`} className="mb-2">
          {line || "\u00A0"}
        </p>
      );
      index++;
    }

    return result;
  };

  const containerClass = isShort ? "line-clamp-5 overflow-hidden" : "";

  return <div className={containerClass}>{processText(text)}</div>;
}
