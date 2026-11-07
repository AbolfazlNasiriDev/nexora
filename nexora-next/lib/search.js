/* Persian-aware search: normalises ی/ک, removes ZWNJ and maps Persian
   spellings of foreign brands to their Latin names. */

const ALIASES = {
  آیفون: "iphone",
  ایفون: "iphone",
  گلکسی: "galaxy",
  مکبوک: "macbook",
  "مک بوک": "macbook",
  ایرپاد: "airpods",
  "ایر پاد": "airpods",
  "پلی استیشن": "playstation",
  پلی‌استیشن: "playstation",
  پلیاستیشن: "playstation",
  ایکسباکس: "xbox",
  "ایکس باکس": "xbox",
  نینتندو: "nintendo",
  سوییچ: "switch",
  هدفون: "headphone",
  هدست: "headset",
  ساعت: "watch",
  لپتاپ: "laptop",
  "لپ تاپ": "laptop",
  تبلت: "tablet",
  شیائومی: "xiaomi",
  سامسونگ: "samsung",
  اپل: "apple",
  هواوی: "huawei",
  سونی: "sony",
  الجی: "lg",
  "ال جی": "lg",
  ایسوس: "asus",
  لنوو: "lenovo",
  اچپی: "hp",
  "اچ پی": "hp",
  دل: "dell",
  اماسآی: "msi",
  "ام اس آی": "msi",
  ریزر: "razer",
  تپلینک: "tp-link",
  "تی پی لینک": "tp-link",
  انکر: "anker",
  جیبیال: "jbl",
  بوز: "bose",
  سونوس: "sonos",
  گوگل: "google",
  پیکسل: "pixel",
  ریلمی: "realme",
  وانپلاس: "oneplus",
  "وان پلاس": "oneplus",
  اوپو: "oppo",
  موتورولا: "motorola",
  نوکیا: "nokia",
  هونر: "honor",
  مک: "mac",
  پرو: "pro",
  ایر: "air",
  مینی: "mini",
  اولترا: "ultra",
};

export const normalise = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[يـ]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const expand = (text) => {
  let out = text;
  Object.entries(ALIASES).forEach(([fa, en]) => {
    if (out.includes(fa)) out = `${out} ${en}`;
  });
  return out;
};

export function searchProducts(products, query, limit = 8) {
  const q = normalise(query);
  if (!q) return [];
  const tokens = expand(q).split(" ").filter(Boolean);
  return products
    .map((product) => {
      const haystack = normalise(
        [product.name, product.brand, product.catName, product.subName, ...(product.tags || [])].join(" ")
      );
      const latinHaystack = expand(haystack);
      let score = 0;
      tokens.forEach((token) => {
        if (haystack.includes(token)) score += 3;
        else if (latinHaystack.includes(token)) score += 2;
        else if (token.length > 3 && haystack.includes(token.slice(0, Math.ceil(token.length * 0.7)))) score += 1;
      });
      return { product, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
    .slice(0, limit)
    .map((row) => row.product);
}
