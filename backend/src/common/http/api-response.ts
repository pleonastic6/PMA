export type ApiResponse<T> = {
  data: T;
  meta: {
    module: string;
  };
};

export function ok<T>(moduleName: string, data: T): ApiResponse<T> {
  return {
    data,
    meta: {
      module: moduleName,
    },
  };
}
