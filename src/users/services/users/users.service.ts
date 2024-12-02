import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/typeorm/entities/User.entity';
import { hashPassword } from 'src/utils/bcrypt';
import {
  CreateUserParams,
  UpdatePassParams,
  UpdateUserParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(userDetails: CreateUserParams): Promise<User> {
    // const { email, password, role } = createUserParams;
    const password = hashPassword(userDetails.password);

    const providers = ['local'];

    try {
      const user = this.userRepository.create({
        ...userDetails,
        password,
        providers,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists.');
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  async createGoogleUser(userDetails: {
    email: string;
    name: string;
    googleId: string;
  }): Promise<User> {
    try {
      const providers = ['google'];
      const user = this.userRepository.create({
        ...userDetails,
        role: UserRole.CUSTOMER,
        password: null,
        googleId: userDetails.googleId,
        providers,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists.');
      }
      throw error;
    }
  }

  async linkGoogleAccount({ email, googleId }) {
    const user = await this.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const providers = user.providers;

    providers.push('google');

    const data = await this.userRepository.create({
      googleId,
      providers,
    });

    await this.userRepository.save(data);

    return 1;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, userDetails: UpdateUserParams) {
    return await this.userRepository.update({ id }, { ...userDetails });
  }

  async updatePassword(id: string, passwordDetails: UpdatePassParams) {
    const password = hashPassword(passwordDetails.password);
    return await this.userRepository.update({ id }, { password });
  }
}
