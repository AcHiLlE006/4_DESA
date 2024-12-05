import { Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';

@Injectable()
export class AzureBlobService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor() {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    this.containerName = process.env.AZURE_CONTAINER_NAME;

    const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }

  async uploadFile(userId: string, fileName: string, fileBuffer: Buffer): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    const blobClient: BlockBlobClient = containerClient.getBlockBlobClient(`${userId}/${fileName}`);

    await blobClient.upload(fileBuffer, fileBuffer.length);
    return blobClient.url;
  }

  async deleteFile(userId: string, fileName: string): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    const blobClient: BlockBlobClient = containerClient.getBlockBlobClient(`${userId}/${fileName}`);

    if (await blobClient.exists()) {
      await blobClient.delete();
    }
  }
}
