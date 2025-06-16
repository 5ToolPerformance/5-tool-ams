// form-generator.ts
// This is a utility script to generate TanStack forms from TypeScript interfaces

type FieldType = "string" | "number" | "boolean" | "Date" | "unknown";

interface FieldInfo {
  name: string;
  type: FieldType;
  optional: boolean;
}

// Parse interface fields manually or use a TypeScript parser
export function parseInterface(interfaceText: string): FieldInfo[] {
  const lines = interfaceText.split("\n");
  const fields: FieldInfo[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith("export") &&
      !trimmed.startsWith("{") &&
      !trimmed.startsWith("}")
    ) {
      const match = trimmed.match(/(\w+)(\?)?:\s*(\w+)/);
      if (match) {
        const [, name, optional, type] = match;
        fields.push({
          name,
          type: type as FieldType,
          optional: !!optional,
        });
      }
    }
  }

  return fields;
}

function generateField(field: FieldInfo): string {
  const inputType = getInputType(field.type);
  const valueTransform = getValueTransform(field.type);

  return `
          <form.Field
            name="${field.name}"
            children={(field) => (
              <div>
                <label htmlFor={field.name}>${formatLabel(field.name)}:</label>
                <input
                  id={field.name}
                  name={field.name}
                  type="${inputType}"
                  value={${getValueExpression(field.type)}}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(${valueTransform})}
                />
                {field.state.meta.errors ? (
                  <em>{field.state.meta.errors}</em>
                ) : null}
              </div>
            )}
          />`;
}

function getInputType(type: FieldType): string {
  switch (type) {
    case "number":
      return "number";
    case "Date":
      return "datetime-local";
    case "boolean":
      return "checkbox";
    default:
      return "text";
  }
}

function getValueExpression(type: FieldType): string {
  switch (type) {
    case "Date":
      return "field.state.value ? field.state.value.toISOString().slice(0, 16) : ''";
    case "boolean":
      return "field.state.value || false";
    default:
      return "field.state.value || ''";
  }
}

function getValueTransform(type: FieldType): string {
  switch (type) {
    case "number":
      return "e.target.value ? Number(e.target.value) : undefined";
    case "Date":
      return "new Date(e.target.value)";
    case "boolean":
      return "e.target.checked";
    default:
      return "e.target.value";
  }
}

function formatLabel(fieldName: string): string {
  return fieldName
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function generateTanStackForm(
  interfaceName: string,
  fields: FieldInfo[]
): string {
  const requiredFields = fields.filter((f) => !f.optional);
  const optionalFields = fields.filter((f) => f.optional);

  const defaultValues = requiredFields
    .map((f) => {
      switch (f.type) {
        case "string":
          return `${f.name}: ''`;
        case "number":
          return `${f.name}: 0`;
        case "boolean":
          return `${f.name}: false`;
        case "Date":
          return `${f.name}: new Date()`;
        default:
          return `${f.name}: ''`;
      }
    })
    .join(",\n      ");

  const allFields = [...requiredFields, ...optionalFields];
  const fieldComponents = allFields.map(generateField).join("\n");

  return `
import { useForm } from '@tanstack/react-form'

export interface ${interfaceName} {
  ${fields.map((f) => `${f.name}${f.optional ? "?" : ""}: ${f.type};`).join("\n  ")}
}

export function ${interfaceName}Form() {
  const form = useForm<${interfaceName}>({
    defaultValues: {
      ${defaultValues}
    } as ${interfaceName},
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
      // Handle form submission
    },
  })

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div>${fieldComponents}
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </button>
          )}
        />
      </form>
    </div>
  )
}`;
}
