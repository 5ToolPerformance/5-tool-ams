declare module "uuid" {
  export function v4(): string;
}

declare module "@azure/storage-blob" {
  export const BlobSASPermissions: {
    parse(value: string): string;
  };
  export interface BlockBlobClient {
    uploadData(
      buffer: Buffer,
      options?: {
        blobHTTPHeaders?: {
          blobContentType?: string;
        };
      }
    ): Promise<void>;
    deleteIfExists(): Promise<void>;
  }
  export interface ContainerClient {
    getBlockBlobClient(blobName: string): BlockBlobClient;
  }
  export class BlobServiceClient {
    static fromConnectionString(connectionString: string): BlobServiceClient;
    getContainerClient(containerName: string): ContainerClient;
  }
  export const SASProtocol: {
    Https: string;
  };
  export class StorageSharedKeyCredential {
    constructor(accountName: string, accountKey: string);
  }
  export interface BlobSASQueryParameters {
    toString(): string;
  }
  export function generateBlobSASQueryParameters(
    options: {
      containerName: string;
      blobName: string;
      permissions: string;
      expiresOn: Date;
      protocol: string;
    },
    credential: StorageSharedKeyCredential
  ): BlobSASQueryParameters;
}
