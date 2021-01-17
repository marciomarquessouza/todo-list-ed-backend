import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInCredentialsDto } from './dto/auth-signin.dto';
import { SignUpCredentialsDto } from './dto/auth-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) signUpDto: SignUpCredentialsDto,
  ): Promise<{ id: number }> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) signInDto: SignInCredentialsDto,
  ): Promise<string> {
    return this.authService.signIn(signInDto);
  }
}
