import jwt from "jsonwebtoken";

export default (id: number): string => {
  return jwt.sign(
    {
      userid: id,
    },
    process.env.SECRETKEY!,
    {
      expiresIn: "15m",
    },
  );
};
