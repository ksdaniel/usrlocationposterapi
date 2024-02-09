import { BlobServiceClient } from "@azure/storage-blob";
export class BlobService {

blobServiceClient: BlobServiceClient | null = null;

  constructor() {
     this.blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  }

    async uploadFile(containerName: string, fileName: string, file: Buffer): Promise<void> {
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.upload(file, file.length);
    }

    async deleteFile(containerName: string, fileName: string): Promise<void> {
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.delete();
    }

    async getFileUrl(containerName: string, fileName: string): Promise<string> {
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        return blockBlobClient.url;
    }

    async getFileBytes(containerName: string, fileName: string): Promise<Buffer> {
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const downloadBlockBlobResponse = await blockBlobClient.download(0);
        const downloaded = await this.streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
        return downloaded;
    }

    public async streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on('data', (data) => {
                chunks.push(data instanceof Buffer ? data : Buffer.from(data));
            });
            readableStream.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
            readableStream.on('error', reject);
        });
    }
}