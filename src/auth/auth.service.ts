import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInCredentialsDto, SignUpCredentialsDto } from './dto';
import { UserRepository } from './user.repository';
import { jwtConfig } from '../config/jwt.config';

const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async generateJWT(email: string): Promise<string> {
    const user = await this.userRepository.findOne({ email });
    const { id, name } = user;
    const { secret, expiresIn } = jwtConfig;
    const payload = { id, name, email };
    return jwt.sign(payload, secret, { expiresIn });
  }

  async signUp(signUpDto: SignUpCredentialsDto): Promise<{ id: number }> {
    return await this.userRepository.signUp(signUpDto);
  }

  async signIn(
    signInDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const email = await this.userRepository.validatePassword(signInDto);

    if (!email) {
      throw new UnauthorizedException('Rejected Credentials');
    }

    const accessToken = await this.generateJWT(email);

    return { accessToken };
  }
}
