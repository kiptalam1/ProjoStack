import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const saltRounds = 12;
  await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hashedpassword: string,
) {
  return await bcrypt.compare(password, hashedpassword);
}
