import z from "zod";

export const postAuthValidator = z.object({
  body: z.object({
    user: z.object({
      email: z.email(),
      password: z.string().max(255),
    }),
  }),
});
