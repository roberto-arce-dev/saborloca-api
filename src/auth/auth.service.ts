import { Injectable, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from './enums/roles.enum';
import { User, UserDocument } from './schemas/user.schema';
import { ClienteProfileService } from '../cliente-profile/cliente-profile.service';
import { ProductorProfileService } from '../productor-profile/productor-profile.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private clienteProfileService: ClienteProfileService,
    private productorProfileService: ProductorProfileService,
  ) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    const existingAdmin = await this.userModel.findOne({ email: 'admin@sistema.com' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin123456', 10);
      await this.userModel.create({
        email: 'admin@sistema.com',
        password: hashedPassword,
        role: Role.ADMIN,
      });
      console.log('✅ Usuario ADMIN creado: admin@sistema.com / Admin123456');
    }
  }

  /**
   * Registro público - Crea User + Profile correspondiente según el rol
   * Factory Pattern: Crea el tipo de profile según el rol
   */
  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 1. Crear User (solo autenticación)
    const newUser = await this.userModel.create({
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role,
    });

    try {
      // 2. Crear Profile según el rol (Factory Pattern)
      if (registerDto.role === Role.CLIENTE) {
        await this.clienteProfileService.create(newUser._id.toString(), {
          nombre: registerDto.nombre,
          telefono: registerDto.telefono,
          direccion: registerDto.direccion,
        });
      } else if (registerDto.role === Role.PRODUCTOR) {
        await this.productorProfileService.create(newUser._id.toString(), {
          nombreNegocio: registerDto.nombreNegocio,
          nombreContacto: registerDto.nombre,
          telefono: registerDto.telefono,
          direccion: registerDto.direccion,
          descripcion: registerDto.descripcion,
        });
      }

      const userObject = newUser.toObject();
      const { password, ...userWithoutPassword } = userObject;

      return {
        user: userWithoutPassword,
        access_token: this.generateToken(userObject),
      };
    } catch (error) {
      // Si falla la creación del profile, eliminar el user creado (rollback)
      await this.userModel.findByIdAndDelete(newUser._id);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    // select('+password') para incluir el password que está oculto por defecto
    const user = await this.userModel.findOne({ email: loginDto.email }).select('+password');

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const userObject = user.toObject();
    const { password, ...userWithoutPassword } = userObject;

    return {
      user: userWithoutPassword,
      access_token: this.generateToken(userObject),
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const userObject = user.toObject();
    const { password, ...userWithoutPassword } = userObject;
    return userWithoutPassword;
  }

  private generateToken(user: any): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async getAllUsers() {
    const users = await this.userModel.find().select('-password');
    return users;
  }
}
