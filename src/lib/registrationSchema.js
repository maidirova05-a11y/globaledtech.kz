import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { z } from "zod";

const namePattern = /^(?=.{2,}$)[\p{L}\p{M}]+(?:-[\p{L}\p{M}]+)*$/u;
const emailPattern = /^(?!.*\s)[^\s@]+@[^\s@]+\.[^\s@]+$/;
const companyPattern = /^(?=.{2,}$)[\p{L}\p{M}\d&.\- ]+$/u;

const sanitizeMarkup = (value) =>
  String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .trim();

const normalizeSpaces = (value) => value.replace(/\s+/g, " ").trim();

const sanitizeText = (value) =>
  normalizeSpaces(sanitizeMarkup(value).replace(/[<>`"'{}[\]\\;$%^*_=+~|]/g, ""));

const sanitizeEmail = (value) => sanitizeMarkup(value).replace(/\s+/g, "").toLowerCase();

const sanitizePhone = (value) =>
  normalizeSpaces(sanitizeMarkup(value).replace(/[^\d+()\-\s]/g, ""));

export const sanitizeRegistrationPayload = (rawPayload) => ({
  name: sanitizeText(rawPayload?.name),
  surname: sanitizeText(rawPayload?.surname),
  email: sanitizeEmail(rawPayload?.email),
  phone: sanitizePhone(rawPayload?.phone),
  company: sanitizeText(rawPayload?.company),
  participationType: sanitizeText(rawPayload?.participationType),
});

export const registrationSchema = z.object({
  name: z
    .string()
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(2, "Имя должно содержать минимум 2 символа")
        .regex(namePattern, "Имя может содержать только буквы и дефис"),
    ),
  surname: z
    .string()
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(2, "Фамилия должна содержать минимум 2 символа")
        .regex(namePattern, "Фамилия может содержать только буквы и дефис"),
    ),
  email: z
    .string()
    .transform(sanitizeEmail)
    .pipe(z.string().regex(emailPattern, "Введите корректный email")),
  phone: z
    .string()
    .transform(sanitizePhone)
    .superRefine((value, ctx) => {
      if (!value || !isValidPhoneNumber(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Введите корректный международный номер",
        });
      }
    })
    .transform((value) => parsePhoneNumber(value)?.number ?? value),
  company: z
    .string()
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(2, "Компания должна содержать минимум 2 символа")
        .regex(
          companyPattern,
          "Компания может содержать только буквы, цифры, пробелы, &, -, .",
        ),
    ),
  participationType: z.enum(["delegate", "speaker", "partner"], {
    errorMap: () => ({ message: "Выберите формат участия" }),
  }),
});

export const parseRegistrationPayload = (rawPayload) =>
  registrationSchema.parse(sanitizeRegistrationPayload(rawPayload));

export const validateRegistrationOnServer = async (rawPayload) =>
  parseRegistrationPayload(rawPayload);
