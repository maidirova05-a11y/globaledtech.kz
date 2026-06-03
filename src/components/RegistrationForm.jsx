import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import PhoneInput, { getCountryCallingCode } from "react-phone-number-input";
import { participationTypeOrder } from "../lib/participationTypes";
import { createRegistrationSchema, parseRegistrationPayload } from "../lib/registrationSchema";

const fieldNames = [
  "name",
  "surname",
  "email",
  "phone",
  "company",
  "participationType",
];

const messageMotion = {
  initial: { opacity: 0, y: -6, height: 0 },
  animate: { opacity: 1, y: 0, height: "auto" },
  exit: { opacity: 0, y: -4, height: 0 },
  transition: { duration: 0.2, ease: "easeOut" },
};

function resolveSubmitErrorMessage(response, result, translations) {
  const backendError = typeof result?.error === "string" ? result.error : "";

  if (backendError === "Registration database is not configured") {
    return "Регистрация временно недоступна: не настроено хранилище заявок.";
  }

  if (backendError === "Failed to save registration") {
    return "Не удалось сохранить заявку. Проверьте настройки хранилища в Vercel.";
  }

  if (backendError === "Validation failed") {
    return "Не удалось отправить заявку: проверьте корректность заполнения формы.";
  }

  if (response.status === 404) {
    return "API регистрации недоступно. Если вы запускаете проект локально, используйте Vercel environment и backend.";
  }

  if (response.status >= 500) {
    return backendError || "Ошибка сервера при отправке заявки.";
  }

  return backendError || translations.messages.submitError;
}

function SearchableCountrySelect({
  value,
  onChange,
  onFocus,
  onBlur,
  options,
  iconComponent: Icon,
  disabled,
  readOnly,
  className,
  labels,
}) {
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    const selectableOptions = options.filter((option) => option.value);

    if (!query) {
      return selectableOptions;
    }

    return selectableOptions.filter((option) => {
      const countryCode = option.value.toLowerCase();
      const countryName = option.label.toLowerCase();
      const callingCode = `+${getCountryCallingCode(option.value)}`;

      return (
        countryCode.includes(query) ||
        countryName.includes(query) ||
        callingCode.includes(query)
      );
    });
  }, [options, search]);

  const selectedOption =
    options.find((option) => option.value === value) ??
    options.find((option) => option.value) ??
    null;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
        onBlur?.();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearch("");
        onBlur?.();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onBlur]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 10);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled || readOnly) {
      return;
    }

    setIsOpen((open) => {
      const nextOpen = !open;

      if (nextOpen) {
        onFocus?.();
      } else {
        setSearch("");
        onBlur?.();
      }

      return nextOpen;
    });
  };

  const handleSelect = (country) => {
    onChange(country);
    setIsOpen(false);
    setSearch("");
    onBlur?.();
  };

  return (
    <div ref={containerRef} className={`phone-country-select ${className || ""}`}>
      <button
        type="button"
        className="phone-country-button"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={labels.countryAria}
      >
        {selectedOption?.value ? (
          <Icon country={selectedOption.value} label={selectedOption.label} />
        ) : null}
        <span className="phone-country-arrow" aria-hidden="true">
          v
        </span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="phone-country-popover"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="phone-country-search"
              placeholder={labels.searchPlaceholder}
              aria-label={labels.searchAria}
            />

            <div className="phone-country-list" role="listbox" aria-label={labels.listAria}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`phone-country-option ${
                      option.value === value ? "phone-country-option-active" : ""
                    }`}
                    onClick={() => handleSelect(option.value)}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    <span className="phone-country-option-flag">
                      <Icon country={option.value} label={option.label} />
                    </span>
                    <span className="phone-country-option-label">{option.label}</span>
                    <span className="phone-country-option-code">
                      +{getCountryCallingCode(option.value)}
                    </span>
                  </button>
                ))
              ) : (
                <p className="phone-country-empty">{labels.empty}</p>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function inferDefaultCountry() {
  return "KZ";
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

export default function RegistrationForm({ language, translations }) {
  const formRef = useRef(null);
  const defaultCountry = useMemo(inferDefaultCountry, []);
  const [submitState, setSubmitState] = useState("idle");
  const [submitError, setSubmitError] = useState("");

  const registrationSchema = useMemo(
    () => createRegistrationSchema(translations.validation),
    [translations.validation],
  );

  const participationOptions = useMemo(
    () => [
      { value: "", label: translations.fields.participationType.placeholder },
      ...participationTypeOrder.map((value) => ({
        value,
        label: translations.participationTypes[value],
      })),
    ],
    [translations],
  );

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
  }, [trigger, watchedValues, language]);

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
    setSubmitError("");

    const payload = parseRegistrationPayload(values, translations.validation);

    const response = await fetch("/api/registrations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setSubmitState("error");
      setSubmitError(resolveSubmitErrorMessage(response, result, translations));
      return;
    }

    setSubmitState("success");
    reset();
  };

  const onInvalidSubmit = (formErrors) => {
    setSubmitState("idle");
    setSubmitError("");
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
      aria-label={translations.aria.form}
    >
      <div className="field-group" data-field="name">
        <label className="field-label" htmlFor="name">
          {translations.fields.name.label}
        </label>
        <input
          id="name"
          type="text"
          placeholder={translations.fields.name.placeholder}
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
          {translations.fields.surname.label}
        </label>
        <input
          id="surname"
          type="text"
          placeholder={translations.fields.surname.placeholder}
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
            {translations.fields.email.label}
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            placeholder={translations.fields.email.placeholder}
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
            {translations.fields.phone.label}
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
                countrySelectComponent={SearchableCountrySelect}
                countrySelectProps={{
                  labels: translations.countryPicker,
                }}
                placeholder={translations.fields.phone.placeholder}
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
            {translations.fields.company.label}
          </label>
          <input
            id="company"
            type="text"
            placeholder={translations.fields.company.placeholder}
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
            {translations.fields.participationType.label}
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
        {isSubmitting ? translations.buttons.submitting : translations.buttons.submit}
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
            {translations.messages.submitSuccess}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {submitState === "error" && submitError ? (
          <motion.p
            key="error"
            className="status-message status-message-error"
            role="alert"
            aria-live="assertive"
            {...messageMotion}
          >
            {submitError}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
