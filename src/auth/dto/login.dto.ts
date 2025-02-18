import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginWithPasswordDto {
  @ApiProperty({ example: 'edwinjohn@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '12345Pass' })
  @IsNotEmpty()
  password: string;
}
