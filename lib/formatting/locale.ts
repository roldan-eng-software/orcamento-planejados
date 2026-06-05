export function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDateBR(date: Date | string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeWhatsapp(phone: string) {
  const digits = onlyDigits(phone);
  return digits.startsWith("55") ? digits : `55${digits}`;
}

export function formatWhatsapp(phone: string) {
  const digits = onlyDigits(phone).replace(/^55/, "");
  if (digits.length !== 11) return phone;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
