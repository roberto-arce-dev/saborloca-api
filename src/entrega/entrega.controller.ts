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
import { EntregaService } from './entrega.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregaDto } from './dto/update-entrega.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Entrega')
@ApiBearerAuth('JWT-auth')
@Controller('entrega')
export class EntregaController {
  constructor(
    private readonly entregaService: EntregaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Entrega' })
  @ApiBody({ type: CreateEntregaDto })
  @ApiResponse({ status: 201, description: 'Entrega creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createEntregaDto: CreateEntregaDto) {
    const data = await this.entregaService.create(createEntregaDto);
    return {
      success: true,
      message: 'Entrega creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Entrega' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Entrega' })
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
  @ApiResponse({ status: 404, description: 'Entrega no encontrado' })
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
    const updated = await this.entregaService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { entrega: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Entregas' })
  @ApiResponse({ status: 200, description: 'Lista de Entregas' })
  async findAll() {
    const data = await this.entregaService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Entrega por ID' })
  @ApiParam({ name: 'id', description: 'ID del Entrega' })
  @ApiResponse({ status: 200, description: 'Entrega encontrado' })
  @ApiResponse({ status: 404, description: 'Entrega no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.entregaService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Entrega' })
  @ApiParam({ name: 'id', description: 'ID del Entrega' })
  @ApiBody({ type: UpdateEntregaDto })
  @ApiResponse({ status: 200, description: 'Entrega actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Entrega no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateEntregaDto: UpdateEntregaDto
  ) {
    const data = await this.entregaService.update(id, updateEntregaDto);
    return {
      success: true,
      message: 'Entrega actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Entrega' })
  @ApiParam({ name: 'id', description: 'ID del Entrega' })
  @ApiResponse({ status: 200, description: 'Entrega eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Entrega no encontrado' })
  async remove(@Param('id') id: string) {
    const entrega = await this.entregaService.findOne(id);
    if (entrega.imagen) {
      const filename = entrega.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.entregaService.remove(id);
    return { success: true, message: 'Entrega eliminado exitosamente' };
  }
}
