import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User.entity';
import { hashPassword } from 'src/utils/bcrypt';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(userDetails: CreateUserParams): Promise<User> {
    // const { email, password, role } = createUserParams;
    const password = hashPassword(userDetails.password);

    try {
      const user = this.userRepository.create({
        ...userDetails,
        password,
        createdAt: new Date(),
      });
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists.');
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, userDetails: UpdateUserParams) {
    return await this.userRepository.update({ id }, { ...userDetails });
  }
}
