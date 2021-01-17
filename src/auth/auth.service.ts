import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInCredentialsDto } from './dto/auth-signin.dto';
import { SignUpCredentialsDto } from './dto/auth-signup.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async signUp(signUpDto: SignUpCredentialsDto): Promise<{ id: number }> {
    return await this.userRepository.signUp(signUpDto);
  }

  async signIn(signInDto: SignInCredentialsDto): Promise<string> {
    const email = await this.userRepository.validatePassword(signInDto);

    if (!email) {
      throw new UnauthorizedException('Rejected Credentials');
    }

    return email;
  }
}
