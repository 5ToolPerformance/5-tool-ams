declare module "uuid" {
  export function v4(): string;
}

declare module "@azure/storage-blob" {
  export const BlobSASPermissions: any;
  export class BlobServiceClient {
    static fromConnectionString(connectionString: string): BlobServiceClient;
    getContainerClient(...args: any[]): any;
  }
  export const SASProtocol: any;
  export class StorageSharedKeyCredential {
    constructor(...args: any[]);
  }
  export const generateBlobSASQueryParameters: any;
}
