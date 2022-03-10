import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginRequestDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginRequestDto: LoginRequestDto) {
    const { email, password } = loginRequestDto;
    const user = await this.userService.readUserByEmail(email, true);

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = this.getJwtAccessToken(user);

      return { tokenType: 'bearer', accessToken };
    } else {
      throw new UnauthorizedException("The password doesn't match.");
    }
  }

  getJwtAccessToken(user: User) {
    const { id, email, name } = user;
    const payload = { id, email, name };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRESIN')}`,
    });

    return token;
  }
}
