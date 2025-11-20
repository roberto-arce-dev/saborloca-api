import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClienteProfile, ClienteProfileDocument } from './schemas/cliente-profile.schema';
import { CreateClienteProfileDto } from './dto/create-cliente-profile.dto';
import { UpdateClienteProfileDto } from './dto/update-cliente-profile.dto';

@Injectable()
export class ClienteProfileService {
  constructor(
    @InjectModel(ClienteProfile.name)
    private clienteProfileModel: Model<ClienteProfileDocument>,
  ) {}

  /**
   * Crear un nuevo perfil de cliente
   */
  async create(
    userId: string,
    createDto: CreateClienteProfileDto,
  ): Promise<ClienteProfile> {
    // Verificar que no exista ya un perfil para este usuario
    const existingProfile = await this.clienteProfileModel
      .findOne({ user: userId })
      .exec();

    if (existingProfile) {
      throw new ConflictException(
        'Ya existe un perfil de cliente para este usuario',
      );
    }

    const newProfile = new this.clienteProfileModel({
      ...createDto,
      user: userId,
    });

    return newProfile.save();
  }

  /**
   * Obtener todos los perfiles de clientes
   */
  async findAll(): Promise<ClienteProfile[]> {
    return this.clienteProfileModel
      .find()
      .populate('user', 'email role createdAt')
      .exec();
  }

  /**
   * Obtener perfil por ID
   */
  async findOne(id: string): Promise<ClienteProfile> {
    const profile = await this.clienteProfileModel
      .findById(id)
      .populate('user', 'email role createdAt')
      .exec();

    if (!profile) {
      throw new NotFoundException(`Perfil de cliente con ID ${id} no encontrado`);
    }

    return profile;
  }

  /**
   * Obtener perfil por User ID
   */
  async findByUserId(userId: string): Promise<ClienteProfile> {
    const profile = await this.clienteProfileModel
      .findOne({ user: userId })
      .populate('user', 'email role createdAt')
      .exec();

    if (!profile) {
      throw new NotFoundException(
        `Perfil de cliente para usuario ${userId} no encontrado`,
      );
    }

    return profile;
  }

  /**
   * Actualizar perfil de cliente
   */
  async update(
    id: string,
    updateDto: UpdateClienteProfileDto,
  ): Promise<ClienteProfile> {
    const updatedProfile = await this.clienteProfileModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('user', 'email role createdAt')
      .exec();

    if (!updatedProfile) {
      throw new NotFoundException(`Perfil de cliente con ID ${id} no encontrado`);
    }

    return updatedProfile;
  }

  /**
   * Eliminar perfil de cliente (soft delete)
   */
  async remove(id: string): Promise<void> {
    const profile = await this.clienteProfileModel.findById(id).exec();

    if (!profile) {
      throw new NotFoundException(`Perfil de cliente con ID ${id} no encontrado`);
    }

    // Soft delete: marcar como inactivo
    profile.isActive = false;
    await profile.save();
  }

  /**
   * Buscar clientes cercanos a una ubicación (query geoespacial)
   */
  async findNearby(
    longitude: number,
    latitude: number,
    maxDistance: number = 10000, // 10km por defecto
  ): Promise<ClienteProfile[]> {
    return this.clienteProfileModel
      .find({
        ubicacion: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistance,
          },
        },
      })
      .populate('user', 'email role')
      .exec();
  }
}
