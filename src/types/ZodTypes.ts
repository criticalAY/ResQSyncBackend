import { z } from 'zod'

export const signupInput = z.object({
    email: z.string().max(100).min(3),
    password: z.string().max(30).min(8),
});

export type SignupParams = z.infer<typeof signupInput>;

export const loginInput = z.object({
    email: z.string().max(100).min(3),
    password: z.string()
});

export type LoginParams = z.infer<typeof loginInput>;
