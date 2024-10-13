import * as bcrypt from 'bcrypt';

const SALT = 10;

export function hashPassword(rawPassword: string) {
  return bcrypt.hashSync(rawPassword, SALT);
}

export function comparePassword(rawPassword: string, hash: string): boolean {
  return bcrypt.compareSync(rawPassword, hash);
}
