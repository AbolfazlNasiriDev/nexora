/* Persian number/price helpers shared by every page. */

export const faDigits = (value) =>
  String(value ?? "").replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export const toNumber = (value) => {
  const clean = String(value ?? "")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[^\d]/g, "");
  return clean ? Number(clean) : 0;
};

export const toman = (value) => faDigits(Math.round(Number(value) || 0).toLocaleString("en-US"));

export const priceLabel = (value) => `${toman(value)} تومان`;

export const faDate = (iso) => {
  try {
    return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return "";
  }
};

export const faDateTime = (iso) => {
  try {
    return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return "";
  }
};

export const orderCode = () => `NX-${Math.floor(100000 + Math.random() * 899999)}`;

export const discountPercent = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
};

export const ORDER_STATUS = {
  pending: { label: "در انتظار تأیید", tone: "bg-amber-50 text-amber-700 border-amber-200" },
  processing: { label: "در حال پردازش", tone: "bg-sky-50 text-sky-700 border-sky-200" },
  shipped: { label: "ارسال شده", tone: "bg-violet-50 text-violet-700 border-violet-200" },
  delivered: { label: "تحویل شده", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  canceled: { label: "لغو شده", tone: "bg-rose-50 text-rose-700 border-rose-200" },
};
