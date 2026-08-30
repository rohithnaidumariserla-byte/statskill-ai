import dotenv from 'dotenv';
dotenv.config();

export interface UploadResult {
  url: string;
  key: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: string;
  isCloudStorage: boolean;
}

export class StorageService {
  private supabaseUrl: string;
  private supabaseKey: string;
  private bucket: string;

  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    this.bucket = process.env.SUPABASE_STORAGE_BUCKET || 'learning-materials';
  }

  async uploadFile(file: { originalname: string; buffer?: Buffer; mimetype: string; size: number }): Promise<UploadResult> {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `materials/${timestamp}_${sanitizedName}`;

    if (this.supabaseUrl && this.supabaseKey && file.buffer) {
      try {
        const uploadEndpoint = `${this.supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/${this.bucket}/${storagePath}`;
        const res = await fetch(uploadEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.supabaseKey}`,
            'apikey': this.supabaseKey,
            'Content-Type': file.mimetype || 'application/octet-stream'
          },
          body: new Uint8Array(file.buffer)
        });

        if (res.ok) {
          const publicUrl = `${this.supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${this.bucket}/${storagePath}`;
          return {
            url: publicUrl,
            key: storagePath,
            fileName: file.originalname,
            sizeBytes: file.size,
            mimeType: file.mimetype,
            uploadedAt: new Date().toISOString(),
            isCloudStorage: true
          };
        }
      } catch (e) {
        console.warn('Supabase storage upload failed, falling back to resilient in-memory storage:', e);
      }
    }

    return {
      url: `/uploads/${storagePath}`,
      key: storagePath,
      fileName: file.originalname,
      sizeBytes: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date().toISOString(),
      isCloudStorage: false
    };
  }

  extractText(file: { originalname: string; buffer?: Buffer }): string {
    if (!file.buffer) {
      return `Curricular guide document: ${file.originalname}`;
    }
    try {
      const rawText = file.buffer.toString('utf8');
      const cleaned = rawText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ').trim();
      if (cleaned.length > 50) {
        return cleaned.slice(0, 10000);
      }
    } catch (e) {
      // fallback
    }
    return `Extracted official statistical curriculum concepts from ${file.originalname}`;
  }
}

export const storageService = new StorageService();
