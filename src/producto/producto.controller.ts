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
  UseGuards,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { UploadService } from '../upload/upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '../auth/enums/roles.enum';

import { ProductorProfileService } from '../productor-profile/productor-profile.service';

@ApiTags('Producto')
@ApiBearerAuth('JWT-auth')
@Controller('producto')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductoController {
  constructor(
    private readonly productoService: ProductoService,
    private readonly uploadService: UploadService,
    private readonly productorProfileService: ProductorProfileService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.PRODUCTOR)
  @ApiOperation({ summary: 'Crear nuevo Producto (Solo ADMIN o PRODUCTOR)' })
  @ApiBody({ type: CreateProductoDto })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async create(@Body() createProductoDto: CreateProductoDto, @Req() req: any) {
    const userId = req.user.userId;
    console.log('🔍 JWT userId (User ID):', userId);
    
    const productorProfile = await this.productorProfileService.findByUserId(userId);
    const productorProfileId = (productorProfile as any)._id.toString();
    
    console.log('🔍 ProductorProfile._id:', productorProfileId);
    console.log('🔍 ProductorProfile.user:', (productorProfile as any).user);
    
    const data = await this.productoService.create(createProductoDto, productorProfileId);
    return {
      success: true,
      message: 'Producto creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @Roles(Role.ADMIN, Role.PRODUCTOR)
  @ApiOperation({ summary: 'Subir imagen para Producto (Solo ADMIN o PRODUCTOR)' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Producto' })
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
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
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
    const updated = await this.productoService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { producto: updated, upload: uploadResult },
    };
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar todos los Productos (Público)' })
  @ApiResponse({ status: 200, description: 'Lista de Productos' })
  async findAll() {
    const data = await this.productoService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener Producto por ID (Público)' })
  @ApiParam({ name: 'id', description: 'ID del Producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.productoService.findOne(id);
    return { success: true, data };
  }

  @Get('productor/:id')
  @Public()
  @ApiOperation({ summary: 'Productos por ProductorProfile ID o User ID' })
  @ApiParam({ name: 'id', description: 'ID del ProductorProfile o ID del User con rol PRODUCTOR' })
  @ApiResponse({ status: 200, description: 'Lista de productos del productor' })
  @ApiResponse({ status: 404, description: 'Productor no encontrado' })
  async findByProductor(@Param('id') id: string) {
    let productorProfileId: string;
    
    try {
      // Primero intentar buscar directamente por ProductorProfile ID
      const productos = await this.productoService.findByProductor(id);
      if (productos.length > 0) {
        return { success: true, data: productos, total: productos.length };
      }
      
      // Si no hay productos, puede que sea un User ID, intentar buscar el ProductorProfile
      const productorProfile = await this.productorProfileService.findByUserId(id);
      productorProfileId = (productorProfile as any)._id.toString();
      
    } catch (error) {
      // Si falla buscar por User ID, asumir que el ID original era ProductorProfile ID
      productorProfileId = id;
    }
    
    const data = await this.productoService.findByProductor(productorProfileId);
    return { success: true, data, total: data.length };
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PRODUCTOR)
  @ApiOperation({ summary: 'Actualizar Producto (Solo ADMIN o PRODUCTOR)' })
  @ApiParam({ name: 'id', description: 'ID del Producto' })
  @ApiBody({ type: UpdateProductoDto })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto
  ) {
    const data = await this.productoService.update(id, updateProductoDto);
    return {
      success: true,
      message: 'Producto actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.PRODUCTOR)
  @ApiOperation({ summary: 'Eliminar Producto (Solo ADMIN o PRODUCTOR)' })
  @ApiParam({ name: 'id', description: 'ID del Producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async remove(@Param('id') id: string) {
    const producto = await this.productoService.findOne(id);
    if (producto.imagen) {
      const filename = producto.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.productoService.remove(id);
    return { success: true, message: 'Producto eliminado exitosamente' };
  }
}
