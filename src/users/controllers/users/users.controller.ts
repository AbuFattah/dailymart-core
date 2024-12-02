import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';
import { Roles } from 'src/auth/utils/roles.decorator';
import { RolesGuard } from 'src/auth/utils/roles.guard';
import { UpdatePassDto } from 'src/users/dtos/UpdatePass.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';

import { UsersService } from 'src/users/services/users/users.service';
import { comparePassword } from 'src/utils/bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return req.user;
  }

  @Patch('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user: any = req.user;

    this.usersService.update(user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async updatePassword(
    @Req() req: Request,
    @Body() updatePassDto: UpdatePassDto,
  ) {
    const user: any = req.user;
    const id: string = user.id;
    const { confirmNewPassword, currentPassword, newPassword } = updatePassDto;

    const userInDb = await this.usersService.findById(id);
    const passInDb = userInDb.password;

    const isCurrentValid = comparePassword(currentPassword, passInDb);

    if (!userInDb) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!isCurrentValid) {
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (newPassword !== confirmNewPassword) {
      throw new HttpException(`Passwords don't match`, HttpStatus.BAD_REQUEST);
    }

    await this.usersService.updatePassword(id, { password: newPassword });
    return { message: 'Password updated successfully' };
  }
}
