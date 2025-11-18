import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ProductorService } from './productor.service';
import { CreateProductorDto } from './dto/create-productor.dto';
import { UpdateProductorDto } from './dto/update-productor.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Productor')
@ApiBearerAuth('JWT-auth')
@Controller('productor')
export class ProductorController {
  constructor(
    private readonly productorService: ProductorService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Productor' })
  @ApiBody({ type: CreateProductorDto })
  @ApiResponse({ status: 201, description: 'Productor creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createProductorDto: CreateProductorDto) {
    const data = await this.productorService.create(createProductorDto);
    return {
      success: true,
      message: 'Productor creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Productor' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Productor' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Productor no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.productorService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { productor: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Productors' })
  @ApiResponse({ status: 200, description: 'Lista de Productors' })
  async findAll() {
    const data = await this.productorService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Productor por ID' })
  @ApiParam({ name: 'id', description: 'ID del Productor' })
  @ApiResponse({ status: 200, description: 'Productor encontrado' })
  @ApiResponse({ status: 404, description: 'Productor no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.productorService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Productor' })
  @ApiParam({ name: 'id', description: 'ID del Productor' })
  @ApiBody({ type: UpdateProductorDto })
  @ApiResponse({ status: 200, description: 'Productor actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Productor no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateProductorDto: UpdateProductorDto
  ) {
    const data = await this.productorService.update(id, updateProductorDto);
    return {
      success: true,
      message: 'Productor actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Productor' })
  @ApiParam({ name: 'id', description: 'ID del Productor' })
  @ApiResponse({ status: 200, description: 'Productor eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Productor no encontrado' })
  async remove(@Param('id') id: string) {
    const productor = await this.productorService.findOne(id);
    if (productor.imagen) {
      const filename = productor.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.productorService.remove(id);
    return { success: true, message: 'Productor eliminado exitosamente' };
  }
}
