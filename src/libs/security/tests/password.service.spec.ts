import { PasswordService } from '../services/password.service';

describe('passwordService', () => {
  let passwordService: PasswordService;

  beforeEach(() => {
    passwordService = new PasswordService();
  });

  describe('scryptHash', () => {
    it('should generate a hash with a new random salt if no salt is provided', async () => {
      const password = 'testPassword';
      const hash = await passwordService.scryptHash(password);

      expect(hash).toMatch(/^[0-9a-f]{64}:[0-9a-f]{32}$/);
    });

    it('should generate the same hash for the same password and salt', async () => {
      const password = 'testPassword';
      const salt = 'testSalt';
      const hash1 = await passwordService.scryptHash(password, salt);
      const hash2 = await passwordService.scryptHash(password, salt);

      expect(hash1).toEqual(hash2);
    });

    it('should generate different hashes for the same password with different salts', async () => {
      const password = 'testPassword';
      const salt1 = 'testSalt1';
      const salt2 = 'testSalt2';
      const hash1 = await passwordService.scryptHash(password, salt1);
      const hash2 = await passwordService.scryptHash(password, salt2);

      expect(hash1).not.toEqual(hash2);
    });

    it('should handle empty password', async () => {
      const password = '';
      const hash = await passwordService.scryptHash(password);

      expect(hash).toMatch(/^[0-9a-f]{64}:[0-9a-f]{32}$/);
    });

    it('should handle long password', async () => {
      const password = 'a'.repeat(1000);
      const hash = await passwordService.scryptHash(password);

      expect(hash).toMatch(/^[0-9a-f]{64}:[0-9a-f]{32}$/);
    });
  });

  describe('scryptVerify', () => {
    it('should return true for the correct password', async () => {
      const password = 'testPassword';
      const hash = await passwordService.scryptHash(password);
      const isValid = await passwordService.scryptVerify(password, hash);

      expect(isValid).toBe(true);
    });

    it('should return false for an incorrect password', async () => {
      const password = 'testPassword';
      const incorrectPassword = 'wrongPassword';
      const hash = await passwordService.scryptHash(password);
      const isValid = await passwordService.scryptVerify(
        incorrectPassword,
        hash,
      );

      expect(isValid).toBe(false);
    });

    it('should return false if the hash format is incorrect', async () => {
      const password = 'testPassword';
      const invalidHash = 'invalidHashFormat';
      const isValid = await passwordService.scryptVerify(password, invalidHash);

      expect(isValid).toBe(false);
    });

    it('should handle empty password verification', async () => {
      const password = 'testPassword';
      const emptyPassword = '';
      const hash = await passwordService.scryptHash(password);
      const isValid = await passwordService.scryptVerify(emptyPassword, hash);

      expect(isValid).toBe(false);
    });

    it('should handle long password verification', async () => {
      const password = 'a'.repeat(1000);
      const hash = await passwordService.scryptHash(password);
      const isValid = await passwordService.scryptVerify(password, hash);

      expect(isValid).toBe(true);
    });
  });
});
