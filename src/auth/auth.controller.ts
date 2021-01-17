import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInCredentialsDto, SignUpCredentialsDto } from './dto';

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
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInDto);
  }
}
