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
import { ClienteProfileService } from './cliente-profile.service';
import { CreateClienteProfileDto } from './dto/create-cliente-profile.dto';
import { UpdateClienteProfileDto } from './dto/update-cliente-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';

@ApiTags('Cliente Profile')
@Controller('cliente-profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ClienteProfileController {
  constructor(private readonly clienteProfileService: ClienteProfileService) {}

  @Post()
  @Roles(Role.CLIENTE, Role.ADMIN)
  @ApiOperation({ summary: 'Crear perfil de cliente' })
  @ApiResponse({ status: 201, description: 'Perfil creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Ya existe un perfil para este usuario' })
  create(@Request() req, @Body() createDto: CreateClienteProfileDto) {
    return this.clienteProfileService.create(req.user.userId, createDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los perfiles de clientes' })
  @ApiResponse({ status: 200, description: 'Lista de perfiles de clientes' })
  findAll() {
    return this.clienteProfileService.findAll();
  }

  @Get('me')
  @Roles(Role.CLIENTE, Role.ADMIN)
  @ApiOperation({ summary: 'Obtener mi perfil de cliente' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario actual' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  getMyProfile(@Request() req) {
    return this.clienteProfileService.findByUserId(req.user.userId);
  }

  @Get('nearby')
  @Roles(Role.PRODUCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar clientes cercanos a una ubicación' })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'maxDistance', required: false, type: Number, description: 'Distancia máxima en metros (default: 10000)' })
  @ApiResponse({ status: 200, description: 'Lista de clientes cercanos' })
  findNearby(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('maxDistance') maxDistance?: number,
  ) {
    return this.clienteProfileService.findNearby(
      Number(longitude),
      Number(latitude),
      maxDistance ? Number(maxDistance) : undefined,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener perfil de cliente por ID' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  findOne(@Param('id') id: string) {
    return this.clienteProfileService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.CLIENTE, Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar perfil de cliente' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  update(@Param('id') id: string, @Body() updateDto: UpdateClienteProfileDto) {
    return this.clienteProfileService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar perfil de cliente (soft delete)' })
  @ApiResponse({ status: 200, description: 'Perfil eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  remove(@Param('id') id: string) {
    return this.clienteProfileService.remove(id);
  }
}
