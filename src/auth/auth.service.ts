import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginWithPasswordDto } from './dto/login.dto';
import { staffAccounts } from 'utils/constants';
import { JwtService } from '@nestjs/jwt';
import { StaffAccount } from 'utils/types';
import { Session } from 'express-session';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /**
   *
   * @param loginDto
   * @returns LOGIN THE USER ACCOUNT AND AUTHENTICATE
   */
  async login(loginDto: LoginWithPasswordDto) {
    const { email, password } = loginDto;

    const user = staffAccounts.find(
      (account) => account.email === email && account.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const accessToken = await this.signToken(user);
    return {
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * LOGOUT THE USER AND DESTROY THE SESSION
   */
  async logOutUser(session: Session) {
    // Destroy the session to log out the user
    session.destroy((err) => {
      if (err) {
        throw new UnauthorizedException('Failed to log out');
      }
    });

    return { message: 'Logout successful' };
  }

  /**
   *
   * @param user
   * @returns  SIGN THE JWT TOKEN FOR THE USER
   */
  private async signToken(user: StaffAccount): Promise<any> {
    const { id, email, role } = user;
    const payload = {
      id,
      email,
      role,
    };
    const secret = process.env.JWT_SECRET || 'BUYSIMPLEJWTSECRET';
    const token_exp = '1hr';
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: `${token_exp}`,
      secret,
    });
    return token;
  }

  /**
   * @param token
   * @returns VERIFY THE JWT TOKEN
   */
  async verifyToken(token: string) {
    const res = await this.jwtService.verifyAsync(token);
    return res;
  }
}
