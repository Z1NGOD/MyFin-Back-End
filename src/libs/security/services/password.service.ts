import crypto from 'node:crypto';
import util from 'node:util';

export class PasswordService {
  async scryptHash(pass: string, salt: string): Promise<string> {
    const saltInUse = salt || crypto.randomBytes(16).toString('hex');
    const hashBuffer = (await util.promisify(crypto.scrypt)(
      pass,
      saltInUse,
      32,
    )) as Buffer;
    return `${hashBuffer.toString('hex')}:${saltInUse}`;
  }

  async scryptVerify(passForHash: string, hashPass: string) {
    const [, salt] = hashPass.split(':');
    return (await this.scryptHash(passForHash, salt)) === hashPass;
  }
}
