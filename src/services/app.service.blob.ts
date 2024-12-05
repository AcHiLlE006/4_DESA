import { Injectable } from '@nestjs/common';
import { BlobClient, BlobServiceClient, BlockBlobClient, StorageSharedKeyCredential, StorageSharedKeyCredentialPolicy } from '@azure/storage-blob';
import { url } from 'inspector';

@Injectable()
export class AzureBlobService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor() {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    this.containerName = process.env.AZURE_CONTAINER_NAME;
    const connectionString = process.env.AZURE_CONNECTION_STRING;
    const accountCredentials = new StorageSharedKeyCredential(accountName, accountKey);
    this.blobServiceClient =BlobServiceClient.fromConnectionString(connectionString);
  }

  async uploadFile(userId: string, fileName: string, file: Express.Multer.File): Promise<string> {

    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    await containerClient.createIfNotExists(); 
    
      const blobClient = containerClient.getBlockBlobClient(`${userId}/${fileName}`);

    try {
      await blobClient.upload(file.buffer, file.size);
      console.log('File uploaded successfully!');
    } catch (error) {
      console.error('Error during file upload:', error);
      throw new Error('Failed to upload file to Azure Blob Storage');
    }
  
    
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
