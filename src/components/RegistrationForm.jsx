import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { parseRegistrationPayload, registrationSchema } from "../lib/registrationSchema";

const fieldNames = [
  "name",
  "surname",
  "email",
  "phone",
  "company",
  "participationType",
];

const participationOptions = [
  { value: "", label: "Выберите вариант" },
  { value: "delegate", label: "Участник" },
  { value: "speaker", label: "Спикер" },
  { value: "partner", label: "Партнер" },
];

const messageMotion = {
  initial: { opacity: 0, y: -6, height: 0 },
  animate: { opacity: 1, y: 0, height: "auto" },
  exit: { opacity: 0, y: -4, height: 0 },
  transition: { duration: 0.2, ease: "easeOut" },
};

function inferDefaultCountry() {
  if (typeof navigator === "undefined") {
    return "KZ";
  }

  const region = navigator.language?.split("-")?.[1]?.toUpperCase();
  return region && region.length === 2 ? region : "KZ";
}

function FieldError({ id, message }) {
  return (
    <AnimatePresence mode="wait">
      {message ? (
        <motion.p
          key={message}
          id={id}
          className="field-error"
          role="alert"
          {...messageMotion}
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

function getFieldClass(hasError, isValid) {
  return [
    "field-input",
    hasError ? "field-input-error" : "",
    isValid ? "field-input-success" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export default function RegistrationForm() {
  const formRef = useRef(null);
  const defaultCountry = useMemo(inferDefaultCountry, []);
  const [submitState, setSubmitState] = useState("idle");
  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    trigger,
    formState: { errors, touchedFields, dirtyFields, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
    shouldFocusError: false,
    delayError: 250,
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      company: "",
      participationType: "",
    },
  });

  const watchedValues = useWatch({ control, name: fieldNames });

  useEffect(() => {
    const hasUserInput = watchedValues.some((value) => String(value ?? "").length > 0);
    if (!hasUserInput) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      void trigger(fieldNames);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [trigger, watchedValues]);

  const isFieldValidated = (fieldName) =>
    !errors[fieldName] &&
    (touchedFields[fieldName] || dirtyFields[fieldName]) &&
    String(watchedValues[fieldNames.indexOf(fieldName)] ?? "").length > 0;

  const scrollToField = (fieldName) => {
    const field = formRef.current?.querySelector(`[data-field="${fieldName}"]`);
    field?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => setFocus(fieldName), 180);
  };

  const onValidSubmit = async (values) => {
    setSubmitState("idle");

    const payload = parseRegistrationPayload(values);

    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    console.log("Registration submitted:", payload);

    setSubmitState("success");
    reset();
  };

  const onInvalidSubmit = (formErrors) => {
    setSubmitState("idle");
    const firstInvalidField = fieldNames.find((fieldName) => formErrors[fieldName]);
    if (firstInvalidField) {
      scrollToField(firstInvalidField);
    }
  };

  const isSubmitDisabled = !isValid || isSubmitting;

  return (
    <form
      ref={formRef}
      className="grid gap-5"
      onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
      noValidate
      aria-label="Форма регистрации на мероприятие"
    >
      <div className="field-group" data-field="name">
        <label className="field-label" htmlFor="name">
          Имя
        </label>
        <input
          id="name"
          type="text"
          placeholder="Ваше имя"
          autoComplete="given-name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={getFieldClass(Boolean(errors.name), isFieldValidated("name"))}
          {...register("name")}
        />
        <FieldError id="name-error" message={errors.name?.message} />
      </div>

      <div className="field-group" data-field="surname">
        <label className="field-label" htmlFor="surname">
          Фамилия
        </label>
        <input
          id="surname"
          type="text"
          placeholder="Ваша фамилия"
          autoComplete="family-name"
          aria-invalid={Boolean(errors.surname)}
          aria-describedby={errors.surname ? "surname-error" : undefined}
          className={getFieldClass(Boolean(errors.surname), isFieldValidated("surname"))}
          {...register("surname")}
        />
        <FieldError id="surname-error" message={errors.surname?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field-group" data-field="email">
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={getFieldClass(Boolean(errors.email), isFieldValidated("email"))}
            {...register("email")}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>

        <div className="field-group" data-field="phone">
          <label className="field-label" htmlFor="phone">
            Телефон
          </label>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <PhoneInput
                {...field}
                id="phone"
                international
                withCountryCallingCode
                defaultCountry={defaultCountry}
                autoComplete="tel"
                countrySelectProps={{ "aria-label": "Выбор страны телефона" }}
                placeholder="+1 202 555 0188"
                className={getFieldClass(Boolean(errors.phone), isFieldValidated("phone"))}
                numberInputProps={{
                  "aria-invalid": Boolean(errors.phone),
                  "aria-describedby": errors.phone ? "phone-error" : undefined,
                  inputMode: "tel",
                }}
                onChange={(value) => field.onChange(value ?? "")}
              />
            )}
          />
          <FieldError id="phone-error" message={errors.phone?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field-group" data-field="company">
          <label className="field-label" htmlFor="company">
            Компания
          </label>
          <input
            id="company"
            type="text"
            placeholder="Название организации"
            autoComplete="organization"
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? "company-error" : undefined}
            className={getFieldClass(Boolean(errors.company), isFieldValidated("company"))}
            {...register("company")}
          />
          <FieldError id="company-error" message={errors.company?.message} />
        </div>

        <div className="field-group" data-field="participationType">
          <label className="field-label" htmlFor="participationType">
            Формат участия
          </label>
          <select
            id="participationType"
            autoComplete="off"
            aria-invalid={Boolean(errors.participationType)}
            aria-describedby={errors.participationType ? "participationType-error" : undefined}
            className={getFieldClass(
              Boolean(errors.participationType),
              isFieldValidated("participationType"),
            )}
            {...register("participationType")}
          >
            {participationOptions.map((option) => (
              <option
                key={option.value || "empty"}
                value={option.value}
                disabled={option.value === ""}
              >
                {option.label}
              </option>
            ))}
          </select>
          <FieldError
            id="participationType-error"
            message={errors.participationType?.message}
          />
        </div>
      </div>

      <button
        type="submit"
        className="button-primary button-submit mt-2 justify-center"
        disabled={isSubmitDisabled}
        aria-disabled={isSubmitDisabled}
      >
        {isSubmitting ? "Отправка..." : "Отправить заявку"}
      </button>

      <AnimatePresence mode="wait">
        {submitState === "success" ? (
          <motion.p
            key="success"
            className="status-message status-message-success"
            role="status"
            aria-live="polite"
            {...messageMotion}
          >
            Спасибо за регистрацию. Наша команда свяжется с вами в ближайшее время.
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
