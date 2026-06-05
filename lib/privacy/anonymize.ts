const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_RE = /(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}/g;

export function anonymizeText(value: string | null | undefined) {
  if (!value) return value;
  return value.replace(EMAIL_RE, "[email anonimizado]").replace(PHONE_RE, "[telefone anonimizado]");
}

export function anonymizedCustomerName() {
  return "Cliente anonimizado";
}

export function anonymizedEmail() {
  return null;
}

export function anonymizedPhone() {
  return null;
}
