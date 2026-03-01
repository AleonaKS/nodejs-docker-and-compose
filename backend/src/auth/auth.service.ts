// src/auth/auth.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';          // ← импортируем Logger
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { verifyPassword } from 'src/utils/auth/passwords/verify';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name); // ← создаём экземпляр

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /** ----------------- SIGNUP ----------------- */
  async signup(createUserDto: CreateUserDto) {
    try {
      if (createUserDto.about === '') {
        delete createUserDto.about;
      }
      const user = await this.usersService.create(createUserDto);
      if (!user) {
        throw new HttpException(
          'Не удалось создать пользователя',
          HttpStatus.BAD_REQUEST,
        );
      }

      const payload = { username: user.username, sub: user.id };
      return { access_token: this.jwtService.sign(payload) };
    } catch (error) {
      // Логируем ошибку (включая стек)
      this.logger.error('Signup error', error.stack);

      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /** ----------------- SIGNIN ----------------- */
  async signin(user: any) {
    const payload = { username: user.username, sub: user.id };
    // Логируем успешный вход (не раскрываем чувствительные данные)
    this.logger.log(`User ${user.username} signed in`);
    return { access_token: this.jwtService.sign(payload) };
  }

  /** ----------------- VALIDATE USER ----------------- */
  async validateUser(username: string, password: string) {
    try {
      const user = await this.usersService.findByUsername(username);
      if (!user) {
        throw new UnauthorizedException('Неверные учетные данные');
      }

      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Неверные учетные данные');
      }

      // Удаляем поле password из результата
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      // Логируем ошибку аутентификации
      this.logger.warn(`ValidateUser failed for ${username}: ${error.message}`);
      throw error; // Nest сам превратит в 401
    }
  }
}
