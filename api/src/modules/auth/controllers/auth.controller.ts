import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/sign-up.dto';
import { Public } from 'src/decorators/public.decorator';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { SignupAdminDto } from '../dto/sign-up-admin.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { ADMIN_ROLE } from 'src/constants';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('mtym-api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const { firstName, lastName, email, password } = signupDto;
    await this.authService.signup(firstName, lastName, email, password);

    return {
      message: 'New account created',
      statusCode: 200,
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login/admin')
  loginAdmin(@Body() loginAdminDto: LoginAdminDto) {
    const { username, password } = loginAdminDto;
    return this.authService.loginAdmin(username, password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup/admin')
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  async signupAdmin(@Body() signupAdminDto: SignupAdminDto) {
    const { username, password } = signupAdminDto;
    await this.authService.signupAdmin(username, password);

    return {
      message: 'New account created',
      statusCode: 200,
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string }) {
    const { email } = body;
    await this.authService.resetPassword(email);

    return {
      statusCode: 200,
    };
  }
}
