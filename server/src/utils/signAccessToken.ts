import jwt from "jsonwebtoken";

export default (id: number, role: string): string => {
  return jwt.sign(
    {
      sub: id,
      role: role,
    },
    process.env.SECRETKEY!,
    {
      expiresIn: "15m",
    },
  );
};
