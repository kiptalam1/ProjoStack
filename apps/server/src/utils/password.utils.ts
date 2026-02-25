import bcrypt from "bcrypt";

export async function hashPassword(inputPassword: string) {
  const saltRounds = 12;
  await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(inputPassword, 12);
}

export async function comparePassword(inputPassword: string, hashedPassword: string) {
	return await bcrypt.compare(inputPassword, hashedPassword);
}
