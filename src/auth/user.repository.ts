import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './auth.entity';
import { SignUpCredentialsDto } from './dto/auth-signup.dto';
import * as bcrypt from 'bcrypt';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async signUp(signUpDto: SignUpCredentialsDto): Promise<{ id: number }> {
    const { email, password, name } = signUpDto;
    const user = new UserEntity();
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPasswordWithSalt(password, user.salt);
    user.name = name;

    try {
      await user.save();
      return { id: user.id };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Email "(${user.email})" is already in use`,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  private async hashPasswordWithSalt(
    password: string,
    salt: string,
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
