export interface PageProps<
  TParams = Record<string, string>,
  TSearchParams = Record<string, string | string[] | undefined>,
> {
  params: Promise<TParams>;
  searchParams: Promise<TSearchParams>;
}
