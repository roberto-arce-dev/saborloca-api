import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadPath = 'public/uploads';
  private readonly thumbnailPath = 'public/uploads/thumbnails';

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ url: string; thumbnailUrl: string }> {
    const filename = `${Date.now()}-${file.originalname}`;
    const imagePath = path.join(this.uploadPath, filename);
    const thumbnailFilename = `thumb-${filename}`;
    const thumbnailPath = path.join(this.thumbnailPath, thumbnailFilename);

    // Guardar imagen original
    await sharp(file.buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toFile(imagePath);

    // Generar thumbnail
    await sharp(file.buffer)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    return {
      url: `uploads/${filename}`,
      thumbnailUrl: `uploads/thumbnails/${thumbnailFilename}`,
    };
  }

  async processImage(
    file: Express.Multer.File,
  ): Promise<{ imagen: string; imagenThumbnail: string }> {
    const result = await this.uploadImage(file);
    return {
      imagen: result.url,
      imagenThumbnail: result.thumbnailUrl,
    };
  }

  async deleteImage(imagePath: string): Promise<void> {
    const fullPath = path.join('public', imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async deleteImages(imagePath: string, thumbnailPath: string): Promise<void> {
    if (imagePath) await this.deleteImage(imagePath);
    if (thumbnailPath) await this.deleteImage(thumbnailPath);
  }
}
