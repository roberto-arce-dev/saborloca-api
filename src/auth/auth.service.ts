import { Injectable, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from './enums/roles.enum';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    const existingAdmin = await this.userModel.findOne({ email: 'admin@sistema.com' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin123456', 10);
      await this.userModel.create({
        nombre: 'Administrador',
        email: 'admin@sistema.com',
        password: hashedPassword,
        role: Role.ADMIN,
      });
      console.log('✅ Usuario ADMIN creado: admin@sistema.com / Admin123456');
    }
  }

  /**
   * Registro público - Solo permite crear CLIENTES
   */
  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Auto-registro siempre crea CLIENTES
    const newUser = await this.userModel.create({
      nombre: registerDto.nombre,
      email: registerDto.email,
      password: hashedPassword,
      role: Role.CLIENTE,  // ← Forzar rol CLIENTE
    });

    const userObject = newUser.toObject();
    const { password, ...userWithoutPassword } = userObject;

    return {
      user: userWithoutPassword,
      access_token: this.generateToken(userObject),
    };
  }

  /**
   * Crear usuario PRODUCTOR - Solo ADMIN puede hacerlo
   */
  async createProductorUser(createProductorDto: any) {
    const existingUser = await this.userModel.findOne({ email: createProductorDto.email });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createProductorDto.password, 10);

    const newUser = await this.userModel.create({
      nombre: createProductorDto.nombre,
      email: createProductorDto.email,
      password: hashedPassword,
      role: Role.PRODUCTOR,  // ← Crear como PRODUCTOR
    });

    const userObject = newUser.toObject();
    const { password, ...userWithoutPassword } = userObject;

    return {
      user: userWithoutPassword,
      access_token: this.generateToken(userObject),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });

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
