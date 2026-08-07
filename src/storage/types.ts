export interface StorageProvider {
  uploadFile(file: Express.Multer.File, bucket?: string): Promise<string>;
  deleteFile(fileUrl: string, bucket?: string): Promise<boolean>;
}
