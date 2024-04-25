import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createAccessToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
  createRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  decode(token: string): string {
    return this.jwtService.decode(token);
  }

  verify(token: string): object {
    return this.jwtService.verify(token);
  }
}
