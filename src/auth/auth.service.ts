import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
