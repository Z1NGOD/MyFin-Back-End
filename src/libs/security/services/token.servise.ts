import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// interface UserPayload {
//   email: string
// }

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async createAccessToken<T>(payload: { sub: T }): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
  async createRefreshToken<T>(payload: { sub: T }): Promise<string> {
    return await this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }

  // decode(token: string): string {
  //   return this.jwtService.decode(token);
  // }

  // verify(token: string): object {
  //   return this.jwtService.verify(token);
  // }
}
