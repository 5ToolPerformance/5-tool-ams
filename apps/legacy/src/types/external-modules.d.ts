declare module "uuid" {
  export function v4(): string;
}

declare module "@azure/storage-blob" {
  export class BlobServiceClient {
    static fromConnectionString(connectionString: string): BlobServiceClient;
    getContainerClient(containerName: string): ContainerClient;
  }

  export class ContainerClient {
    getBlockBlobClient(blobName: string): BlockBlobClient;
  }

  export class BlockBlobClient {
    uploadData(
      data: Buffer,
      options?: {
        blobHTTPHeaders?: {
          blobContentType?: string;
        };
      }
    ): Promise<unknown>;
    deleteIfExists(): Promise<unknown>;
  }

  export class StorageSharedKeyCredential {
    constructor(accountName: string, accountKey: string);
  }

  export class BlobSASPermissions {
    static parse(permissions: string): BlobSASPermissions;
  }

  export const SASProtocol: {
    Https: "https";
  };

  export function generateBlobSASQueryParameters(
    options: {
      containerName: string;
      blobName: string;
      permissions: BlobSASPermissions;
      expiresOn: Date;
      protocol: "https";
    },
    credential: StorageSharedKeyCredential
  ): {
    toString(): string;
  };
}
