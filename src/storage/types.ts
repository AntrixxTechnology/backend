export interface StorageProvider {
  uploadFile(file: Express.Multer.File, bucket?: string): Promise<string>;
  deleteFile(fileUrl: string, bucket?: string): Promise<boolean>;
  downloadFile?(bucket: string, fileName: string): Promise<{ data: Buffer; contentType: string } | null>;
}
