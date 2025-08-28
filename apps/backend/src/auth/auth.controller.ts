import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ThrottleAuthGuard } from '../common/guards/throttle-auth.guard';
import { RegisterDtoSwagger, LoginDtoSwagger, RefreshTokenDtoSwagger } from '../dto/auth.dto';
import { AuthenticatedRequest } from '../types';
import { RegisterDto, LoginDto, RefreshTokenDto } from '../dto/auth.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(ThrottleAuthGuard)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDtoSwagger })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async register(@Body() body: RegisterDto) {
    try {
      return await this.authService.register(body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al registrar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @UseGuards(ThrottleAuthGuard)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDtoSwagger })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async login(@Body() body: LoginDto) {
    try {
      return await this.authService.login(body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al iniciar sesión',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('refresh')
  @UseGuards(ThrottleAuthGuard)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDtoSwagger })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async refreshToken(@Body() body: RefreshTokenDto) {
    try {
      return await this.authService.refreshToken(body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al refrescar token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Request() req: AuthenticatedRequest) {
    try {
      return await this.authService.logout(parseInt(req.user.id, 10));
    } catch (error) {
      throw new HttpException(
        'Error al cerrar sesión',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'User info retrieved successfully' })
  async getProfile(@Request() req: AuthenticatedRequest) {
    return {
      user: req.user,
    };
  }
}
