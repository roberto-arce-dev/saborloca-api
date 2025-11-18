import {
  Controller,
  Post,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({
    summary: 'Subir imagen',
    description: 'Sube una imagen al servidor, la procesa y genera un thumbnail automáticamente. La imagen se redimensiona a máximo 1920x1080 y el thumbnail a 300x300.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (JPG, PNG, etc.) - Máximo 5MB'
        }
      },
      required: ['file']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Imagen subida exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Imagen subida exitosamente' },
        imagen: { type: 'string', example: 'uploads/1700000000000-imagen.jpg' },
        imagenThumbnail: { type: 'string', example: 'uploads/thumbnails/thumb-1700000000000-imagen.jpg' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Archivo inválido o no proporcionado' })
  async uploadImage(@Req() request: FastifyRequest) {
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    // Convertir el stream a buffer
    const buffer = await data.toBuffer();

    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const result = await this.uploadService.processImage(file);

    return {
      message: 'Imagen subida exitosamente',
      ...result,
    };
  }
}
