import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인',
    description: '로그인하여 토큰을 발급합니다.',
  })
  @ApiBody({
    type: LoginRequestDto,
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        data: {
          tokenType: 'bearer',
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGRvbWFpbi5jb20iLCJuYW1lIjoi7ZmN6ri464-ZIiwicGhvbmUiOiIwMTAtMDAwMC0wMDAwIiwiaWF0IjoxNjQ2NjcwMTY4LCJleHAiOjE2NDY2NzE5Njh9.Wcld42AkPKwgEf0IZdIMjfGTRJURJfDXeP5K1LNJjDY',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: '이메일이 잘못 되었습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '비밀번호가 잘못 되었습니다.',
  })
  @Post('/login')
  login(@Body() loginRequestDto: LoginRequestDto) {
    return this.authService.login(loginRequestDto);
  }
}
