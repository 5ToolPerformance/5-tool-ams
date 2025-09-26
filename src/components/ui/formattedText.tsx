import { JSX } from "react";

interface FormattedTextProps {
  text: string | null | undefined;
  isShort?: boolean;
}

function FormattedText({ text, isShort = false }: FormattedTextProps) {
  if (!text) return null;
  const processText = (text: string): JSX.Element[] => {
    const lines = text.split("\n");
    const result: JSX.Element[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();

      if (line.startsWith("- ")) {
        // Start collecting list items
        const listItems: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("- ")) {
          const item = lines[i].trim().substring(2).trim();
          if (item) listItems.push(item);
          i++;
        }

        result.push(
          <ul key={`list-${result.length}`} className="mb-4 ml-6 list-disc">
            {listItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
        continue; // Don't increment i again
      } else {
        // Regular paragraph
        result.push(
          <p key={`p-${result.length}`} className="mb-2">
            {line || "\u00A0"}
          </p>
        );
      }
      i++;
    }

    return result;
  };

  const containerClass = isShort ? "line-clamp-5 overflow-hidden" : "";

  return <div className={containerClass}>{processText(text)}</div>;
}

export default FormattedText;
