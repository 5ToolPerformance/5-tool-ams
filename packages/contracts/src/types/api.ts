/**
 * Type for Generic API Response
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Type for Route Parameters
 */
export type RouteParams<T = Record<string, string>> = {
  params: Promise<T>;
};
