import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductorProfile, ProductorProfileDocument } from './schemas/productor-profile.schema';
import { CreateProductorProfileDto } from './dto/create-productor-profile.dto';
import { UpdateProductorProfileDto } from './dto/update-productor-profile.dto';

@Injectable()
export class ProductorProfileService {
  constructor(
    @InjectModel(ProductorProfile.name)
    private productorProfileModel: Model<ProductorProfileDocument>,
  ) {}

  async create(userId: string, createDto: CreateProductorProfileDto): Promise<ProductorProfile> {
    const existingProfile = await this.productorProfileModel.findOne({ user: new Types.ObjectId(userId) }).exec();
    if (existingProfile) {
      throw new ConflictException('Ya existe un perfil de productor para este usuario');
    }
    const newProfile = new this.productorProfileModel({ ...createDto, user: new Types.ObjectId(userId) });
    return newProfile.save();
  }

  async findAll(verifiedOnly: boolean = false): Promise<ProductorProfile[]> {
    const filter = verifiedOnly ? { isVerified: true } : {};
    return this.productorProfileModel.find(filter).populate('user', 'email role createdAt').exec();
  }

  async findOne(id: string): Promise<ProductorProfile> {
    const profile = await this.productorProfileModel.findById(id).populate('user', 'email role createdAt').exec();
    if (!profile) {
      throw new NotFoundException(`Perfil de productor con ID ${id} no encontrado`);
    }
    return profile;
  }

  async findByUserId(userId: string): Promise<ProductorProfile> {
    const profile = await this.productorProfileModel.findOne({ user: new Types.ObjectId(userId) }).populate('user', 'email role createdAt').exec();
    if (!profile) {
      throw new NotFoundException(`Perfil de productor para usuario ${userId} no encontrado`);
    }
    return profile;
  }

  async update(id: string, updateDto: UpdateProductorProfileDto): Promise<ProductorProfile> {
    const updatedProfile = await this.productorProfileModel.findByIdAndUpdate(id, updateDto, { new: true }).populate('user', 'email role createdAt').exec();
    if (!updatedProfile) {
      throw new NotFoundException(`Perfil de productor con ID ${id} no encontrado`);
    }
    return updatedProfile;
  }

  async verify(id: string): Promise<ProductorProfile> {
    const profile = await this.productorProfileModel.findById(id).exec();
    if (!profile) {
      throw new NotFoundException(`Perfil de productor con ID ${id} no encontrado`);
    }
    profile.isVerified = true;
    return profile.save();
  }

  async remove(id: string): Promise<void> {
    const profile = await this.productorProfileModel.findById(id).exec();
    if (!profile) {
      throw new NotFoundException(`Perfil de productor con ID ${id} no encontrado`);
    }
    profile.isActive = false;
    await profile.save();
  }

  async findNearby(longitude: number, latitude: number, maxDistance: number = 10000, categorias?: string[]): Promise<ProductorProfile[]> {
    const filter: any = {
      ubicacion: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: maxDistance,
        },
      },
    };
    if (categorias && categorias.length > 0) {
      filter.categorias = { $in: categorias };
    }
    return this.productorProfileModel.find(filter).populate('user', 'email role').exec();
  }

  async findByCategoria(categoria: string): Promise<ProductorProfile[]> {
    return this.productorProfileModel.find({ categorias: categoria, isActive: true }).populate('user', 'email role').exec();
  }
}
