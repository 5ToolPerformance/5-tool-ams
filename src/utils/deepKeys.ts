// Utility type to get all deep keys of an object in dot notation
export type DeepKeyOf<T> = (
  T extends object
    ? {
        [K in Extract<keyof T, string>]: T[K] extends object
          ? K | `${K}.${DeepKeyOf<T[K]>}`
          : K
      }[Extract<keyof T, string>]
    : never
);