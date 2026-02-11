import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}
