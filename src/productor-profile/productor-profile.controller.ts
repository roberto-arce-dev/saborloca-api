import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductorProfileService } from './productor-profile.service';
import { CreateProductorProfileDto } from './dto/create-productor-profile.dto';
import { UpdateProductorProfileDto } from './dto/update-productor-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';

@ApiTags('Productor Profile')
@Controller('api/productor-profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ProductorProfileController {
  constructor(private readonly productorProfileService: ProductorProfileService) {}

  @Post()
  @Roles(Role.PRODUCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Crear perfil de productor' })
  @ApiResponse({ status: 201, description: 'Perfil creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Ya existe un perfil para este usuario' })
  create(@Request() req, @Body() createDto: CreateProductorProfileDto) {
    return this.productorProfileService.create(req.user.userId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los perfiles de productores' })
  @ApiQuery({ name: 'verified', required: false, type: Boolean, description: 'Filtrar solo verificados' })
  @ApiResponse({ status: 200, description: 'Lista de perfiles de productores' })
  findAll(@Query('verified') verified?: boolean) {
    return this.productorProfileService.findAll(verified === true);
  }

  @Get('me')
  @Roles(Role.PRODUCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Obtener mi perfil de productor' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario actual' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  getMyProfile(@Request() req) {
    return this.productorProfileService.findByUserId(req.user.userId);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Buscar productores cercanos a una ubicación' })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'maxDistance', required: false, type: Number, description: 'Distancia máxima en metros' })
  @ApiQuery({ name: 'categorias', required: false, type: String, description: 'Categorías separadas por coma' })
  @ApiResponse({ status: 200, description: 'Lista de productores cercanos' })
  findNearby(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('maxDistance') maxDistance?: number,
    @Query('categorias') categorias?: string,
  ) {
    const categoriasArray = categorias ? categorias.split(',') : undefined;
    return this.productorProfileService.findNearby(
      Number(longitude),
      Number(latitude),
      maxDistance ? Number(maxDistance) : undefined,
      categoriasArray,
    );
  }

  @Get('categoria/:categoria')
  @ApiOperation({ summary: 'Buscar productores por categoría' })
  @ApiResponse({ status: 200, description: 'Lista de productores en la categoría' })
  findByCategoria(@Param('categoria') categoria: string) {
    return this.productorProfileService.findByCategoria(categoria);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener perfil de productor por ID' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  findOne(@Param('id') id: string) {
    return this.productorProfileService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.PRODUCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar perfil de productor' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  update(@Param('id') id: string, @Body() updateDto: UpdateProductorProfileDto) {
    return this.productorProfileService.update(id, updateDto);
  }

  @Patch(':id/verify')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Verificar productor (solo admin)' })
  @ApiResponse({ status: 200, description: 'Productor verificado exitosamente' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  verify(@Param('id') id: string) {
    return this.productorProfileService.verify(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar perfil de productor (soft delete)' })
  @ApiResponse({ status: 200, description: 'Perfil eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  remove(@Param('id') id: string) {
    return this.productorProfileService.remove(id);
  }
}
