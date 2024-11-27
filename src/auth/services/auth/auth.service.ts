import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users/users.service';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findOneByEmail(email);

      if (user.password === null) return null;
      const isValid = comparePassword(password, user.password);

      if (user && isValid) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw new BadRequestException('Invalid credentials');
    }
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException("Credentials don't match");
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateGoogleUser(googleUser: {
    email: string;
    name: string;
    googleId: string;
  }) {
    const user = await this.userService.findOneByEmail(googleUser.email);

    // console.log(user);

    if (!user) {
      return this.userService.createGoogleUser(googleUser);
    }

    return user;
  }

  // googleLogin(user: { email: string; id: string; role: string }) {
  //   if (!user) {
  //     return 'No user from google';
  //   }

  //   const payload = { email: user.email, sub: user.id, role: user.role };

  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  googleLogin(req) {
    if (!req.user) {
      return { access_token: null, message: 'No user from google' };
    }

    const user = req.user;

    const payload = { email: user.email, sub: user.id, role: user.role };

    // return {
    //   message: 'User information from google',
    //   user: req.user,
    // };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
