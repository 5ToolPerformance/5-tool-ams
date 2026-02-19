import { env } from "@/env/server";
import {
  BlobSASPermissions,
  BlobServiceClient,
  SASProtocol,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";

interface UploadFileParams {
    buffer: Buffer;
    storageKey: string;
    mimeType: string;
}

export class AzureBlobStorage {
    private blobServiceClient: BlobServiceClient;
    private containerName: string;
    private accountName: string;
    private accountKey: string;

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
        const credentials = this.parseConnectionString(connectionString);
        this.accountName = credentials.accountName;
        this.accountKey = credentials.accountKey;
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

    async deleteFile(storageKey: string) {
        const containerClient =
            this.blobServiceClient.getContainerClient(this.containerName);
        const blobClient = containerClient.getBlockBlobClient(storageKey);
        await blobClient.deleteIfExists();
    }

    getReadUrl(storageKey: string, expiresInMinutes = 15) {
        const credential = new StorageSharedKeyCredential(
            this.accountName,
            this.accountKey
        );

        const expiresOn = new Date(
            Date.now() + expiresInMinutes * 60 * 1000
        );

        const sasToken = generateBlobSASQueryParameters(
            {
                containerName: this.containerName,
                blobName: storageKey,
                permissions: BlobSASPermissions.parse("r"),
                expiresOn,
                protocol: SASProtocol.Https,
            },
            credential
        ).toString();

        const blobUrl = `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${storageKey}`;
        return `${blobUrl}?${sasToken}`;
    }

    getUploadUrl(storageKey: string, expiresInMinutes = 15) {
        const credential = new StorageSharedKeyCredential(
            this.accountName,
            this.accountKey
        );

        const expiresOn = new Date(
            Date.now() + expiresInMinutes * 60 * 1000
        );

        const sasToken = generateBlobSASQueryParameters(
            {
                containerName: this.containerName,
                blobName: storageKey,
                permissions: BlobSASPermissions.parse("cw"),
                expiresOn,
                protocol: SASProtocol.Https,
            },
            credential
        ).toString();

        const blobUrl = `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${storageKey}`;
        return `${blobUrl}?${sasToken}`;
    }

    private parseConnectionString(connectionString: string) {
        const segments = connectionString.split(";").filter(Boolean);
        const values = new Map<string, string>();
        for (const segment of segments) {
            const [key, value] = segment.split("=", 2);
            if (!key || value === undefined) continue;
            values.set(key, value);
        }

        const accountName = values.get("AccountName");
        const accountKey = values.get("AccountKey");
        if (!accountName || !accountKey) {
            throw new Error(
                "AZURE_STORAGE_CONNECTION_STRING missing AccountName or AccountKey"
            );
        }

        return { accountName, accountKey };
    }
}
