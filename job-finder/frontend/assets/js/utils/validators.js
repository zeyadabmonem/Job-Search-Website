export function required(value) {
  return String(value || "").trim().length > 0;
}

export function minLength(value, min) {
  return String(value || "").trim().length >= min;
}

export function emailFormat(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}
