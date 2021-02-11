import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorators';
import { SignInCredentialsDto, SignUpCredentialsDto } from './dto';
import { IUser } from './user.interface';

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

  @Get('/profile')
  getProfile(@GetUser() user: IUser): IUser {
    return user;
  }
}
