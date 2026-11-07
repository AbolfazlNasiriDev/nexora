/* ==========================================================================
   NEXORA — Categories, mega-menu structure & category-specific filters
   All category ids are used by products.js, catalog.js and admin.js
   ========================================================================== */

const CATEGORIES = [
  {
    id: 'mobile',
    name: 'موبایل و تبلت',
    short: 'موبایل',
    icon: 'smartphone',
    tagline: 'گوشی، تبلت و لوازم جانبی موبایل',
    desc: 'جدیدترین گوشی‌های هوشمند سامسونگ، اپل، شیائومی و موتورولا همراه با تبلت، قلم لمسی، شارژر و پاوربانک.',
    color: '#5B45E8',
    tint: '#EFEBFF',
    subs: [
      { id: 'phones', name: 'گوشی موبایل' },
      { id: 'samsung', name: 'گوشی سامسونگ' },
      { id: 'apple', name: 'گوشی اپل' },
      { id: 'xiaomi', name: 'گوشی شیائومی' },
      { id: 'motorola', name: 'گوشی موتورولا' },
      { id: 'budget', name: 'گوشی اقتصادی' },
      { id: 'flagship', name: 'گوشی پرچم‌دار' },
      { id: 'tablet', name: 'تبلت' },
      { id: 'stylus', name: 'قلم لمسی' },
      { id: 'cases', name: 'قاب و کاور موبایل' },
      { id: 'glass', name: 'گلس محافظ' },
      { id: 'charger-mobile', name: 'شارژر موبایل' },
      { id: 'cable', name: 'کابل شارژ' },
      { id: 'powerbank', name: 'پاوربانک' }
    ]
  },
  {
    id: 'laptop',
    name: 'لپ‌تاپ و کامپیوتر',
    short: 'لپ‌تاپ',
    icon: 'laptop',
    tagline: 'لپ‌تاپ، کامپیوتر و مانیتور',
    desc: 'لپ‌تاپ‌های گیمینگ، دانشجویی و اداری از ایسوس، لنوو، اچ‌پی و اپل در کنار کامپیوتر رومیزی، مانیتور و لوازم جانبی.',
    color: '#0EA5E9',
    tint: '#E6F6FE',
    subs: [
      { id: 'asus-laptop', name: 'لپ‌تاپ ایسوس' },
      { id: 'lenovo', name: 'لپ‌تاپ لنوو' },
      { id: 'hp', name: 'لپ‌تاپ اچ‌پی' },
      { id: 'apple-laptop', name: 'لپ‌تاپ اپل' },
      { id: 'gaming-laptop', name: 'لپ‌تاپ گیمینگ' },
      { id: 'student', name: 'لپ‌تاپ دانشجویی' },
      { id: 'office', name: 'لپ‌تاپ اداری' },
      { id: 'desktop', name: 'کامپیوتر رومیزی' },
      { id: 'aio', name: 'آل‌این‌وان' },
      { id: 'mini-pc', name: 'مینی کامپیوتر' },
      { id: 'monitor', name: 'مانیتور' },
      { id: 'keyboard', name: 'کیبورد' },
      { id: 'mouse', name: 'ماوس' },
      { id: 'mousepad', name: 'پد ماوس' },
      { id: 'webcam', name: 'وب‌کم' }
    ]
  },
  {
    id: 'parts',
    name: 'قطعات کامپیوتر',
    short: 'قطعات',
    icon: 'cpu',
    tagline: 'قطعات تخصصی اسمبل و ارتقا',
    desc: 'پردازنده، کارت گرافیک، مادربرد، رم، حافظه SSD و تمام قطعات مورد نیاز برای اسمبل یا ارتقای سیستم.',
    color: '#F97316',
    tint: '#FFF2E7',
    subs: [
      { id: 'cpu', name: 'پردازنده CPU' },
      { id: 'gpu', name: 'کارت گرافیک' },
      { id: 'motherboard', name: 'مادربرد' },
      { id: 'ram', name: 'رم' },
      { id: 'ssd', name: 'حافظه SSD' },
      { id: 'hdd', name: 'هارد HDD' },
      { id: 'psu', name: 'پاور' },
      { id: 'case', name: 'کیس' },
      { id: 'cooler', name: 'خنک‌کننده پردازنده' },
      { id: 'case-fan', name: 'فن کیس' },
      { id: 'network-card', name: 'کارت شبکه' },
      { id: 'assembly', name: 'تجهیزات اسمبل' }
    ]
  },
  {
    id: 'accessories',
    name: 'لوازم جانبی',
    short: 'لوازم جانبی',
    icon: 'headphones',
    tagline: 'هدست، اسپیکر و لوازم جانبی دیجیتال',
    desc: 'هدفون، هندزفری، هدست گیمینگ، اسپیکر، میکروفون، هاب، تبدیل و لوازم جانبی روزمره دیجیتال.',
    color: '#EC4899',
    tint: '#FDEBF4',
    subs: [
      { id: 'headphones', name: 'هدفون' },
      { id: 'earbuds', name: 'هندزفری' },
      { id: 'gaming-headset', name: 'هدست گیمینگ' },
      { id: 'speaker', name: 'اسپیکر' },
      { id: 'microphone', name: 'میکروفون' },
      { id: 'hdmi', name: 'کابل HDMI' },
      { id: 'usb-cable', name: 'کابل USB' },
      { id: 'usb-hub', name: 'هاب USB' },
      { id: 'adapter', name: 'تبدیل‌ها' },
      { id: 'charger', name: 'شارژر' },
      { id: 'dock', name: 'داک استیشن' },
      { id: 'stand', name: 'استند لپ‌تاپ' },
      { id: 'laptop-bag', name: 'کیف لپ‌تاپ' }
    ]
  },
  {
    id: 'wearables',
    name: 'ساعت و گجت هوشمند',
    short: 'گجت هوشمند',
    icon: 'watch',
    tagline: 'ساعت، مچ‌بند و گجت‌های هوشمند',
    desc: 'ساعت هوشمند، مچ‌بند سلامتی، عینک هوشمند، ردیاب و گجت‌های کاربردی برای زندگی هوشمند.',
    color: '#14B8A6',
    tint: '#E6FAF7',
    subs: [
      { id: 'smartwatch', name: 'ساعت هوشمند' },
      { id: 'band', name: 'مچ‌بند هوشمند' },
      { id: 'smart-glasses', name: 'عینک هوشمند' },
      { id: 'tracker', name: 'ردیاب هوشمند' },
      { id: 'gadgets', name: 'گجت‌های کاربردی' },
      { id: 'smart-home-devices', name: 'تجهیزات خانه هوشمند' }
    ]
  },
  {
    id: 'gaming',
    name: 'کنسول و بازی',
    short: 'گیمینگ',
    icon: 'gamepad-2',
    tagline: 'کنسول، دسته بازی و صندلی گیمینگ',
    desc: 'پلی‌استیشن، ایکس‌باکس، نینتندو، دسته بازی، بازی‌های کامپیوتری و لوازم جانبی گیمینگ.',
    color: '#EF4444',
    tint: '#FDECEC',
    subs: [
      { id: 'playstation', name: 'پلی‌استیشن' },
      { id: 'xbox', name: 'ایکس‌باکس' },
      { id: 'nintendo', name: 'نینتندو' },
      { id: 'gamepad', name: 'دسته بازی' },
      { id: 'pc-games', name: 'بازی کامپیوتری' },
      { id: 'console-games', name: 'بازی کنسول' },
      { id: 'gaming-chair', name: 'صندلی گیمینگ' },
      { id: 'gaming-accessories', name: 'لوازم جانبی گیمینگ' },
      { id: 'vr', name: 'واقعیت مجازی' }
    ]
  },
  {
    id: 'cameras',
    name: 'دوربین و تصویربرداری',
    short: 'دوربین',
    icon: 'camera',
    tagline: 'دوربین، لنز و تجهیزات استودیویی',
    desc: 'دوربین عکاسی و فیلم‌برداری، دوربین ورزشی و نظارتی، لنز، سه‌پایه و تجهیزات نورپردازی.',
    color: '#8B5CF6',
    tint: '#F3EDFF',
    subs: [
      { id: 'dslr', name: 'دوربین عکاسی' },
      { id: 'camcorder', name: 'دوربین فیلم‌برداری' },
      { id: 'action-cam', name: 'دوربین ورزشی' },
      { id: 'security-cam', name: 'دوربین نظارتی' },
      { id: 'tripod', name: 'سه‌پایه' },
      { id: 'lens', name: 'لنز' },
      { id: 'lighting', name: 'تجهیزات نورپردازی' },
      { id: 'memory-card', name: 'کارت حافظه' }
    ]
  },
  {
    id: 'audio',
    name: 'صوتی و تصویری',
    short: 'صوتی و تصویری',
    icon: 'tv',
    tagline: 'تلویزیون، پروژکتور و سینمای خانگی',
    desc: 'تلویزیون هوشمند، پروژکتور، سینمای خانگی، ساندبار و گیرنده دیجیتال برای تجربه تصویری کامل.',
    color: '#3B82F6',
    tint: '#EAF2FE',
    subs: [
      { id: 'tv', name: 'تلویزیون' },
      { id: 'projector', name: 'پروژکتور' },
      { id: 'home-theater', name: 'سینمای خانگی' },
      { id: 'home-speaker', name: 'اسپیکر خانگی' },
      { id: 'soundbar', name: 'ساندبار' },
      { id: 'receiver', name: 'گیرنده دیجیتال' }
    ]
  },
  {
    id: 'home',
    name: 'لوازم خانه و زندگی',
    short: 'خانه و زندگی',
    icon: 'home',
    tagline: 'لوازم برقی و تجهیزات هوشمند خانه',
    desc: 'جاروبرقی، تصفیه هوا، لوازم آشپزخانه و تجهیزات نظافت برای خانه‌ای هوشمندتر و راحت‌تر.',
    color: '#10B981',
    tint: '#E7FAF3',
    subs: [
      { id: 'vacuum', name: 'جاروبرقی' },
      { id: 'air-purifier', name: 'تصفیه هوا' },
      { id: 'kitchen', name: 'لوازم آشپزخانه' },
      { id: 'small-appliance', name: 'لوازم برقی کوچک' },
      { id: 'cleaning', name: 'تجهیزات نظافت' },
      { id: 'smart-home', name: 'تجهیزات هوشمند خانه' }
    ]
  },
  {
    id: 'network',
    name: 'شبکه و اداری',
    short: 'شبکه و اداری',
    icon: 'router',
    tagline: 'مودم، روتر و تجهیزات اداری',
    desc: 'مودم، روتر، سوییچ شبکه، تجهیزات وای‌فای و پرینتر، اسکنر و دستگاه حضور و غیاب برای دفتر کار.',
    color: '#64748B',
    tint: '#EEF2F7',
    subs: [
      { id: 'modem', name: 'مودم' },
      { id: 'router', name: 'روتر' },
      { id: 'switch', name: 'سوییچ شبکه' },
      { id: 'wifi', name: 'تجهیزات وای‌فای' },
      { id: 'printer', name: 'پرینتر' },
      { id: 'scanner', name: 'اسکنر' },
      { id: 'attendance', name: 'دستگاه حضور و غیاب' },
      { id: 'nas', name: 'تجهیزات ذخیره‌سازی شبکه' }
    ]
  }
];

/* Filters that only make sense inside a given category. */
const CATEGORY_FILTERS = {
  mobile: [
    { key: 'ram', label: 'حافظه رم', options: ['۴ گیگابایت', '۶ گیگابایت', '۸ گیگابایت', '۱۲ گیگابایت', '۱۶ گیگابایت'] },
    { key: 'storage', label: 'ظرفیت حافظه', options: ['۶۴ گیگابایت', '۱۲۸ گیگابایت', '۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت'] },
    { key: 'battery', label: 'ظرفیت باتری', options: ['۳۵۰۰ میلی‌آمپر', '۴۰۰۰ میلی‌آمپر', '۴۵۰۰ میلی‌آمپر', '۵۰۰۰ میلی‌آمپر', '۶۰۰۰ میلی‌آمپر'] },
    { key: 'screen', label: 'اندازه صفحه', options: ['۶.۱ اینچ', '۶.۵ اینچ', '۶.۷ اینچ', '۶.۹ اینچ', '۱۱ اینچ'] }
  ],
  laptop: [
    { key: 'cpu', label: 'پردازنده', options: ['Core i5', 'Core i7', 'Core i9', 'Ryzen 5', 'Ryzen 7', 'Apple M3', 'Apple M4'] },
    { key: 'ram', label: 'حافظه رم', options: ['۸ گیگابایت', '۱۶ گیگابایت', '۳۲ گیگابایت', '۶۴ گیگابایت'] },
    { key: 'storage', label: 'حافظه داخلی', options: ['۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت', '۲ ترابایت'] },
    { key: 'gpu', label: 'کارت گرافیک', options: ['RTX 4050', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'Intel Iris Xe', 'Radeon Graphics', 'Apple GPU'] },
    { key: 'screen', label: 'اندازه نمایشگر', options: ['۱۳.۳ اینچ', '۱۴ اینچ', '۱۵.۶ اینچ', '۱۶ اینچ', '۲۷ اینچ'] }
  ],
  parts: [
    { key: 'family', label: 'نوع قطعه', options: ['پردازنده', 'کارت گرافیک', 'مادربرد', 'رم', 'حافظه SSD', 'هارد', 'پاور', 'کیس', 'خنک‌کننده'] },
    { key: 'capacity', label: 'ظرفیت', options: ['۵۰۰ گیگابایت', '۱ ترابایت', '۲ ترابایت', '۸ گیگابایت', '۱۶ گیگابایت', '۳۲ گیگابایت'] },
    { key: 'socket', label: 'سوکت / رابط', options: ['LGA 1700', 'AM5', 'PCIe 4.0', 'PCIe 5.0', 'DDR5', 'DDR4'] }
  ],
  accessories: [
    { key: 'connection', label: 'نوع اتصال', options: ['بی‌سیم', 'سیمی', 'بلوتوث'] },
    { key: 'family', label: 'نوع محصول', options: ['هدفون', 'هندزفری', 'اسپیکر', 'میکروفون', 'هاب و تبدیل', 'شارژر'] }
  ],
  wearables: [
    { key: 'batteryLife', label: 'عمر باتری', options: ['۱ روز', '۲ روز', '۷ روز', '۱۴ روز'] },
    { key: 'compat', label: 'سازگاری', options: ['اندروید و iOS', 'فقط اندروید', 'فقط iOS'] }
  ],
  gaming: [
    { key: 'platform', label: 'پلتفرم', options: ['PlayStation 5', 'Xbox Series', 'Nintendo Switch', 'PC', 'همه پلتفرم‌ها'] },
    { key: 'family', label: 'نوع محصول', options: ['کنسول', 'دسته بازی', 'بازی', 'صندلی گیمینگ', 'هدست گیمینگ', 'واقعیت مجازی'] }
  ],
  cameras: [
    { key: 'resolution', label: 'دقت تصویر', options: ['۱۲ مگاپیکسل', '۲۴ مگاپیکسل', '۳۳ مگاپیکسل', '۴۵ مگاپیکسل', '۴K'] },
    { key: 'family', label: 'نوع دوربین', options: ['دوربین عکاسی', 'دوربین ورزشی', 'دوربین نظارتی', 'لنز', 'تجهیزات نورپردازی'] }
  ],
  audio: [
    { key: 'screen', label: 'اندازه صفحه', options: ['۵۰ اینچ', '۵۵ اینچ', '۶۵ اینچ', '۷۵ اینچ'] },
    { key: 'family', label: 'نوع محصول', options: ['تلویزیون', 'پروژکتور', 'سینمای خانگی', 'ساندبار'] }
  ],
  home: [
    { key: 'family', label: 'نوع محصول', options: ['جاروبرقی', 'تصفیه هوا', 'لوازم آشپزخانه', 'لوازم برقی کوچک', 'تجهیزات نظافت'] },
    { key: 'capacity', label: 'ظرفیت / توان', options: ['۱ لیتر', '۲ لیتر', '۴ لیتر', '۱۵۰۰ وات', '۲۰۰۰ وات'] }
  ],
  network: [
    { key: 'family', label: 'نوع محصول', options: ['مودم', 'روتر', 'سوییچ', 'پرینتر', 'اسکنر', 'ذخیره‌سازی شبکه'] },
    { key: 'speed', label: 'سرعت شبکه', options: ['AC1200', 'AX3000', 'AX5400', 'گیگابیتی'] }
  ]
};

/* Brand catalogue used by filters, the brand strip and the admin panel. */
const BRANDS = [
  { name: 'Apple', fa: 'اپل', color: '#111827' },
  { name: 'Samsung', fa: 'سامسونگ', color: '#1D4ED8' },
  { name: 'Xiaomi', fa: 'شیائومی', color: '#F97316' },
  { name: 'Asus', fa: 'ایسوس', color: '#0F172A' },
  { name: 'Lenovo', fa: 'لنوو', color: '#DC2626' },
  { name: 'HP', fa: 'اچ‌پی', color: '#0EA5E9' },
  { name: 'Sony', fa: 'سونی', color: '#111827' },
  { name: 'Logitech', fa: 'لاجیتک', color: '#0F172A' },
  { name: 'JBL', fa: 'جی‌بی‌ال', color: '#F59E0B' },
  { name: 'Anker', fa: 'انکر', color: '#0EA5E9' },
  { name: 'Motorola', fa: 'موتورولا', color: '#2563EB' },
  { name: 'Dell', fa: 'دل', color: '#0EA5E9' },
  { name: 'MSI', fa: 'ام‌اس‌آی', color: '#DC2626' },
  { name: 'Razer', fa: 'ریزر', color: '#22C55E' },
  { name: 'Bose', fa: 'بوز', color: '#111827' },
  { name: 'Canon', fa: 'کانن', color: '#DC2626' },
  { name: 'Nikon', fa: 'نیکون', color: '#F59E0B' },
  { name: 'TP-Link', fa: 'تی‌پی-لینک', color: '#0EA5E9' },
  { name: 'Dyson', fa: 'دایسون', color: '#7C3AED' },
  { name: 'Microsoft', fa: 'مایکروسافت', color: '#16A34A' },
  { name: 'Nintendo', fa: 'نینتندو', color: '#DC2626' },
  { name: 'LG', fa: 'ال‌جی', color: '#B91C1C' },
  { name: 'Intel', fa: 'اینتل', color: '#1D4ED8' },
  { name: 'AMD', fa: 'ای‌ام‌دی', color: '#DC2626' },
  { name: 'NVIDIA', fa: 'انویدیا', color: '#16A34A' },
  { name: 'Kingston', fa: 'کینگستون', color: '#DC2626' },
  { name: 'WD', fa: 'وسترن دیجیتال', color: '#0F172A' },
  { name: 'Epson', fa: 'اپسون', color: '#1D4ED8' },
  { name: 'Ray-Ban', fa: 'ری‌بن', color: '#0F172A' },
  { name: 'Meta', fa: 'متا', color: '#1D4ED8' },
  { name: 'GoPro', fa: 'گوپرو', color: '#111827' },
  { name: 'DJI', fa: 'دی‌جی‌آی', color: '#0F172A' },
  { name: 'Philips', fa: 'فیلیپس', color: '#1D4ED8' },
  { name: 'Synology', fa: 'سینولوژی', color: '#0F172A' }
];

/* ------------------------------------------------------------------ helpers */
const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

function getCategory(id) {
  return CATEGORY_MAP[id] || null;
}

function getSubName(catId, subId) {
  const cat = CATEGORY_MAP[catId];
  if (!cat) return '';
  const sub = cat.subs.find((s) => s.id === subId);
  return sub ? sub.name : cat.name;
}

function categoryUrl(catId, subId) {
  return subId ? `category.html?cat=${catId}&sub=${subId}` : `category.html?cat=${catId}`;
}

function findCategoryBySub(subId) {
  return CATEGORIES.find((c) => c.subs.some((s) => s.id === subId)) || null;
}

/* Admin edits (stored in LocalStorage) override the built-in categories. */
(function nxLoadSavedCategories() {
  try {
    const raw = localStorage.getItem('nexora_admin_categories');
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved) || !saved.length) return;
    CATEGORIES.length = 0;
    saved.forEach((cat) => CATEGORIES.push(cat));
    Object.keys(CATEGORY_MAP).forEach((key) => delete CATEGORY_MAP[key]);
    CATEGORIES.forEach((cat) => {
      CATEGORY_MAP[cat.id] = cat;
    });
  } catch (error) {
    /* ignore corrupted storage and fall back to the built-in catalogue */
  }
})();
