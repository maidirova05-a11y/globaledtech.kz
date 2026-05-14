import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { z } from "zod";

const namePattern = /^(?=.{2,}$)[\p{L}\p{M}]+(?:-[\p{L}\p{M}]+)*$/u;
const emailPattern = /^(?!.*\s)[^\s@]+@[^\s@]+\.[^\s@]+$/;
const companyPattern = /^(?=.{2,}$)[\p{L}\p{M}\d&.\- ]+$/u;

const defaultValidationMessages = {
  nameMin: "Имя должно содержать минимум 2 символа",
  namePattern: "Имя может содержать только буквы и дефис",
  surnameMin: "Фамилия должна содержать минимум 2 символа",
  surnamePattern: "Фамилия может содержать только буквы и дефис",
  emailInvalid: "Введите корректный email",
  phoneInvalid: "Введите корректный международный номер",
  companyMin: "Компания должна содержать минимум 2 символа",
  companyPattern: "Компания может содержать только буквы, цифры, пробелы, &, -, .",
  participationRequired: "Выберите формат участия",
};

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

export function createRegistrationSchema(validationMessages = defaultValidationMessages) {
  const messages = {
    ...defaultValidationMessages,
    ...validationMessages,
  };

  return z.object({
    name: z
      .string()
      .transform(sanitizeText)
      .pipe(
        z
          .string()
          .min(2, messages.nameMin)
          .regex(namePattern, messages.namePattern),
      ),
    surname: z
      .string()
      .transform(sanitizeText)
      .pipe(
        z
          .string()
          .min(2, messages.surnameMin)
          .regex(namePattern, messages.surnamePattern),
      ),
    email: z
      .string()
      .transform(sanitizeEmail)
      .pipe(z.string().regex(emailPattern, messages.emailInvalid)),
    phone: z
      .string()
      .transform(sanitizePhone)
      .superRefine((value, ctx) => {
        if (!value || !isValidPhoneNumber(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.phoneInvalid,
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
          .min(2, messages.companyMin)
          .regex(companyPattern, messages.companyPattern),
      ),
    participationType: z.enum(["delegate", "speaker", "partner"], {
      errorMap: () => ({ message: messages.participationRequired }),
    }),
  });
}

export const registrationSchema = createRegistrationSchema();

export const parseRegistrationPayload = (rawPayload, validationMessages) =>
  createRegistrationSchema(validationMessages).parse(sanitizeRegistrationPayload(rawPayload));

export const validateRegistrationOnServer = async (rawPayload) =>
  parseRegistrationPayload(rawPayload);
