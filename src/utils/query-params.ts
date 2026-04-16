/**
 * Extracts and validates query parameters based on allowed filters
 * @param query - Next.js query object from req.query
 * @param allowedFilters - Array of allowed filter keys
 * @returns Typed partial object with only allowed filters
 */
export function extractFilters<T extends Record<string, unknown>>(
  query: Partial<Record<keyof T, string | string[] | undefined>>,
  allowedFilters: readonly (keyof T)[]
): Partial<T> {
  const filters: Partial<T> = {};

  for (const key of allowedFilters) {
    const value = query[key];

    // Only process if value exists and is a string (not array)
    if (value && typeof value === "string") {
      // Type assertion is safe here because we're iterating over allowedFilters
      filters[key] = value as T[keyof T];
    }
  }

  return filters;
}
