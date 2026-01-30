import { env } from "@/env/server";
import { BlobServiceClient } from "@azure/storage-blob";

interface UploadFileParams {
    buffer: Buffer;
    storageKey: string;
    mimeType: string;
}

export class AzureBlobStorage {
    private blobServiceClient: BlobServiceClient;
    private containerName: string;

    constructor() {
        const connectionString = env.AZURE_STORAGE_CONNECTION_STRING;
        const containerName = env.AZURE_STORAGE_CONTAINER_NAME;

        if (!connectionString) {
            throw new Error("AZURE_STORAGE_CONNECTION_STRING is not set");
        }

        if (!containerName) {
            throw new Error("AZURE_STORAGE_CONTAINER_NAME is not set");
        }

        this.blobServiceClient =
            BlobServiceClient.fromConnectionString(connectionString);

        this.containerName = containerName;
    }

    async uploadFile({ buffer, storageKey, mimeType }: UploadFileParams) {
        const containerClient =
            this.blobServiceClient.getContainerClient(this.containerName);

        const blobClient = containerClient.getBlockBlobClient(storageKey);

        await blobClient.uploadData(buffer, {
            blobHTTPHeaders: {
                blobContentType: mimeType,
            },
        });

        return {
            storageProvider: "azure_blob",
            storageKey,
        };
    }
}
