import { z } from "zod";

export const loginSchema = z.object({
  nis: z.string().min(9, "NIS is Required"),
  password: z.string().min(6, "password required"),
});

export const registerSchema = z.object({
  nis: z.string().min(9, "NIS is Required"),
  name: z.string().min(1, "Name is Required"),
  kelas: z.string().min(1, "Kelas is Required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});
