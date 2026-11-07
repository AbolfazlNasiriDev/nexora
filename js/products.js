/* ==========================================================================
   NEXORA — Central product catalogue
   Every page (home, listing, filters, search, compare, cart, admin) reads
   from this single source. Prices are sample data, not live market prices.
   ========================================================================== */

const NX_COLORS = {
  black: { name: 'مشکی', hex: '#1C1F2E' },
  graphite: { name: 'گرافیتی', hex: '#3F4451' },
  white: { name: 'سفید', hex: '#F3F4F8' },
  silver: { name: 'نقره‌ای', hex: '#C9CEDC' },
  titanium: { name: 'تیتانیوم', hex: '#8D8F96' },
  gray: { name: 'خاکستری', hex: '#6B7280' },
  blue: { name: 'آبی', hex: '#2563EB' },
  navy: { name: 'سرمه‌ای', hex: '#1E293B' },
  purple: { name: 'بنفش', hex: '#6D28D9' },
  red: { name: 'قرمز', hex: '#DC2626' },
  green: { name: 'سبز', hex: '#16A34A' },
  gold: { name: 'طلایی', hex: '#D4AF37' },
  pink: { name: 'صورتی', hex: '#F472B6' },
  teal: { name: 'فیروزه‌ای', hex: '#0D9488' },
  orange: { name: 'نارنجی', hex: '#EA580C' },
  beige: { name: 'بژ', hex: '#D6C7B0' }
};

const NX_FILTER_LABELS = {
  ram: 'حافظه رم',
  storage: 'حافظه داخلی',
  battery: 'ظرفیت باتری',
  screen: 'صفحه نمایش',
  cpu: 'پردازنده',
  gpu: 'کارت گرافیک',
  capacity: 'ظرفیت',
  socket: 'سوکت / رابط',
  connection: 'نوع اتصال',
  family: 'نوع محصول',
  batteryLife: 'عمر باتری',
  compat: 'سازگاری',
  platform: 'پلتفرم',
  resolution: 'دقت تصویر',
  speed: 'سرعت شبکه'
};

const NX_CATEGORY_COPY = {
  mobile: 'صفحه‌نمایش باکیفیت، پردازنده قدرتمند و باتری پرظرفیت، این محصول را برای استفاده روزمره، عکاسی و اجرای اپلیکیشن‌های سنگین مناسب کرده است.',
  laptop: 'بدنه‌ای سبک و مقاوم همراه با پردازنده نسل جدید و نمایشگر باکیفیت، انتخابی متعادل برای کار، تحصیل و سرگرمی.',
  parts: 'قطعه‌ای اصل با عملکرد پایدار و سازگاری بالا برای اسمبل یا ارتقای سیستم؛ مناسب کاربران حرفه‌ای و گیمرها.',
  accessories: 'طراحی ارگونومیک، کیفیت ساخت بالا و اتصال پایدار، تجربه‌ای راحت و بی‌وقفه در استفاده روزانه.',
  wearables: 'پایش سلامتی، اعلان‌های هوشمند و باتری با دوام، همراه همیشگی شما در طول روز.',
  gaming: 'تجربه‌ای روان و هیجان‌انگیز با تأخیر پایین، ساخت محکم و طراحی مخصوص گیمرها.',
  cameras: 'کیفیت تصویر بالا، فوکوس دقیق و کنترل کامل، مناسب عکاسی حرفه‌ای، محتواسازی و ثبت لحظه‌ها.',
  audio: 'تصویر و صدای فراگیر با کیفیت بالا، طراحی مدرن و اتصال‌های کامل برای خانه یا دفتر کار.',
  home: 'کارایی بالا، مصرف بهینه و طراحی مدرن برای راحت‌تر کردن کارهای روزمره خانه.',
  network: 'اتصال پایدار و پرسرعت، مدیریت آسان و کیفیت ساخت مناسب برای خانه و محیط اداری.'
};

const NX_CATEGORY_FEATURES = {
  mobile: ['نمایشگر با کیفیت و روشنایی بالا', 'پشتیبانی از شارژ سریع', 'دوربین چندگانه با حالت شب'],
  laptop: ['بدنه سبک و قابل حمل', 'کیبورد با نور پس‌زمینه', 'خنک‌کننده کم‌صدا و بهینه'],
  parts: ['عملکرد پایدار زیر بار کاری سنگین', 'سازگار با پلتفرم‌های رایج', 'گارانتی معتبر'],
  accessories: ['کیفیت ساخت پریمیوم', 'اتصال سریع و پایدار', 'طراحی ارگونومیک'],
  wearables: ['پایش ضربان قلب و خواب', 'مقاومت در برابر آب و گردوغبار', 'همگام‌سازی با گوشی'],
  gaming: ['تأخیر پایین و دقت بالا', 'ساخت محکم و بادوام', 'طراحی مخصوص گیمینگ'],
  cameras: ['کیفیت تصویر حرفه‌ای', 'فوکوس سریع و دقیق', 'بدنه مقاوم و ارگونومیک'],
  audio: ['کیفیت تصویر و صدای بالا', 'اتصال‌های کامل ورودی', 'طراحی مدرن و کم‌حجم'],
  home: ['مصرف انرژی بهینه', 'کارایی بالا و کم‌صدا', 'طراحی جمع‌وجور و مدرن'],
  network: ['راه‌اندازی سریع و آسان', 'پایداری بالا در شبکه', 'مدیریت از طریق اپلیکیشن']
};

/* -------------------------------------------------------------------------- */
/*  Raw catalogue                                                             */
/* -------------------------------------------------------------------------- */
const RAW_PRODUCTS = [
  /* ------------------------------- موبایل -------------------------------- */
  {
    id: 'iphone-17-pro', name: 'گوشی موبایل اپل iPhone 17 Pro ظرفیت ۲۵۶ گیگابایت',
    brand: 'Apple', cat: 'mobile', sub: 'apple', price: 92500000, old: 104000000,
    stock: 9, rating: 4.9, reviews: 412, art: 'phone', tags: ['new', 'bestseller', 'amazing'],
    colors: ['titanium', 'navy', 'black'],
    filters: { ram: '۸ گیگابایت', storage: '۲۵۶ گیگابایت', battery: '۴۵۰۰ میلی‌آمپر', screen: '۶.۵ اینچ' },
    desc: 'iPhone 17 Pro با بدنه تیتانیومی، تراشه A19 Pro و سیستم دوربین سه‌گانه، مرزهای عکاسی موبایل و اجرای اپلیکیشن‌های حرفه‌ای را جابه‌جا می‌کند. نمایشگر ProMotion با نرخ نوسازی تطبیقی، تجربه‌ای بسیار روان در بازی و اسکرول ارائه می‌دهد.',
    features: ['تراشه A19 Pro با عملکرد فوق‌العاده', 'دوربین سه‌گانه ۴۸ مگاپیکسلی', 'بدنه تیتانیومی سبک و مقاوم']
  },
  {
    id: 'galaxy-s25-ultra', name: 'گوشی موبایل سامسونگ Galaxy S25 Ultra ظرفیت ۲۵۶ گیگابایت',
    brand: 'Samsung', cat: 'mobile', sub: 'samsung', price: 71900000, old: 82000000,
    stock: 14, rating: 4.8, reviews: 386, art: 'phone', tags: ['bestseller', 'amazing'],
    colors: ['titanium', 'black', 'blue'],
    filters: { ram: '۱۲ گیگابایت', storage: '۲۵۶ گیگابایت', battery: '۵۰۰۰ میلی‌آمپر', screen: '۶.۹ اینچ' },
    desc: 'گلکسی S25 Ultra با قلم S Pen، دوربین ۲۰۰ مگاپیکسلی و نمایشگر Dynamic AMOLED 2X، پرچم‌دار کامل سامسونگ برای کاربران حرفه‌ای است.',
    features: ['قلم S Pen داخل بدنه', 'دوربین اصلی ۲۰۰ مگاپیکسل', 'نمایشگر ۶.۹ اینچی Dynamic AMOLED']
  },
  {
    id: 'xiaomi-15', name: 'گوشی موبایل شیائومی 15 ظرفیت ۲۵۶ گیگابایت',
    brand: 'Xiaomi', cat: 'mobile', sub: 'xiaomi', price: 38500000, old: 44000000,
    stock: 22, rating: 4.7, reviews: 208, art: 'phone', tags: ['new', 'recommended'],
    colors: ['black', 'green', 'white'],
    filters: { ram: '۱۲ گیگابایت', storage: '۲۵۶ گیگابایت', battery: '۵۰۰۰ میلی‌آمپر', screen: '۶.۵ اینچ' },
    desc: 'شیائومی 15 با لنزهای Leica، شارژ سریع ۹۰ وات و پردازنده اسنپدراگون نسل جدید، ترکیبی از عکاسی حرفه‌ای و عملکرد پرچم‌دار را ارائه می‌دهد.',
    features: ['دوربین همکاری Leica', 'شارژ سریع ۹۰ وات', 'نمایشگر AMOLED با نرخ ۱۲۰ هرتز']
  },
  {
    id: 'motorola-edge-60-pro', name: 'گوشی موبایل موتورولا Edge 60 Pro ظرفیت ۲۵۶ گیگابایت',
    brand: 'Motorola', cat: 'mobile', sub: 'motorola', price: 27800000, old: 33000000,
    stock: 11, rating: 4.5, reviews: 96, art: 'phone',
    colors: ['blue', 'black'],
    filters: { ram: '۸ گیگابایت', storage: '۲۵۶ گیگابایت', battery: '۵۰۰۰ میلی‌آمپر', screen: '۶.۷ اینچ' },
    desc: 'موتورولا Edge 60 Pro با نمایشگر منحنی pOLED، بدنه سبک و شارژ سریع، گزینه‌ای جذاب در بازه قیمتی میان‌رده رو به بالا است.',
    features: ['نمایشگر منحنی pOLED', 'شارژ سریع ۶۸ وات', 'بدنه سبک با پوشش ضدآب']
  },
  {
    id: 'galaxy-a56', name: 'گوشی موبایل سامسونگ Galaxy A56 ظرفیت ۱۲۸ گیگابایت',
    brand: 'Samsung', cat: 'mobile', sub: 'budget', price: 16900000, old: 19500000,
    stock: 34, rating: 4.4, reviews: 512, art: 'phone', tags: ['bestseller'],
    colors: ['black', 'blue', 'pink'],
    filters: { ram: '۸ گیگابایت', storage: '۱۲۸ گیگابایت', battery: '۵۰۰۰ میلی‌آمپر', screen: '۶.۷ اینچ' },
    desc: 'گلکسی A56 با پشتیبانی چندساله از به‌روزرسانی سیستم‌عامل، نمایشگر Super AMOLED و باتری پرظرفیت، یکی از مطمئن‌ترین انتخاب‌های اقتصادی بازار است.',
    features: ['چهار سال به‌روزرسانی اندروید', 'نمایشگر Super AMOLED', 'باتری ۵۰۰۰ میلی‌آمپری']
  },
  {
    id: 'iphone-17', name: 'گوشی موبایل اپل iPhone 17 ظرفیت ۱۲۸ گیگابایت',
    brand: 'Apple', cat: 'mobile', sub: 'apple', price: 68000000, old: 74000000,
    stock: 16, rating: 4.8, reviews: 174, art: 'phone', tags: ['new'],
    colors: ['pink', 'black', 'blue'],
    filters: { ram: '۸ گیگابایت', storage: '۱۲۸ گیگابایت', battery: '۴۰۰۰ میلی‌آمپر', screen: '۶.۱ اینچ' },
    desc: 'iPhone 17 با تراشه A19، دوربین دوگانه ارتقایافته و طراحی جمع‌وجور، تجربه iOS را با قیمتی متعادل‌تر ارائه می‌کند.',
    features: ['تراشه A19', 'دوربین اصلی ۴۸ مگاپیکسل', 'طراحی جمع‌وجور و سبک']
  },
  {
    id: 'redmi-note-14-pro', name: 'گوشی موبایل شیائومی Redmi Note 14 Pro ظرفیت ۲۵۶ گیگابایت',
    brand: 'Xiaomi', cat: 'mobile', sub: 'budget', price: 11400000, old: 13900000,
    stock: 48, rating: 4.3, reviews: 731, art: 'phone', tags: ['bestseller', 'amazing'],
    colors: ['black', 'purple', 'green'],
    filters: { ram: '۸ گیگابایت', storage: '۲۵۶ گیگابایت', battery: '۵۰۰۰ میلی‌آمپر', screen: '۶.۷ اینچ' },
    desc: 'ردمی نوت 14 پرو با نمایشگر AMOLED ۱۲۰ هرتز، دوربین ۲۰۰ مگاپیکسلی و باتری ۵۵۰۰ میلی‌آمپری، پرفروش‌ترین انتخاب اقتصادی NEXORA است.',
    features: ['دوربین ۲۰۰ مگاپیکسل OIS', 'شارژ سریع ۴۵ وات', 'مقاومت IP64']
  },
  {
    id: 'ipad-air-m3', name: 'تبلت اپل iPad Air 11 اینچ نسل M3 ظرفیت ۲۵۶ گیگابایت',
    brand: 'Apple', cat: 'mobile', sub: 'tablet', price: 46500000, old: 52000000,
    stock: 7, rating: 4.8, reviews: 121, art: 'tablet', tags: ['recommended'],
    colors: ['silver', 'black', 'blue'],
    filters: { ram: '۸ گیگابایت', storage: '۲۵۶ گیگابایت', battery: '۶۰۰۰ میلی‌آمپر', screen: '۱۱ اینچ' },
    desc: 'آیپد ایر با تراشه M3 و پشتیبانی از Apple Pencil Pro، برای طراحی، یادداشت‌برداری و تماشای محتوا انتخابی سبک و قدرتمند است.',
    features: ['تراشه Apple M3', 'پشتیبانی از Apple Pencil Pro', 'نمایشگر Liquid Retina ۱۱ اینچ']
  },
  {
    id: 'anker-powercore-20000', name: 'پاوربانک انکر PowerCore 20000 میلی‌آمپر با شارژ سریع',
    brand: 'Anker', cat: 'mobile', sub: 'powerbank', price: 3290000, old: 3900000,
    stock: 60, rating: 4.6, reviews: 340, art: 'powerbank', tags: ['bestseller'],
    colors: ['black', 'white'], filters: {},
    desc: 'پاوربانک ۲۰۰۰۰ میلی‌آمپری انکر با خروجی ۳۰ وات و دو پورت، گوشی و تبلت شما را در سفر شارژ نگه می‌دارد.',
    features: ['ظرفیت ۲۰۰۰۰ میلی‌آمپر', 'خروجی سریع ۳۰ وات', 'نمایشگر وضعیت شارژ']
  },

  /* ------------------------------- لپ‌تاپ -------------------------------- */
  {
    id: 'macbook-air-m4', name: 'لپ‌تاپ ۱۳ اینچی اپل MacBook Air M4 ظرفیت ۲۵۶ گیگابایت',
    brand: 'Apple', cat: 'laptop', sub: 'apple-laptop', price: 78500000, old: 86000000,
    stock: 6, rating: 4.9, reviews: 268, art: 'laptop', tags: ['new', 'bestseller', 'recommended'],
    colors: ['silver', 'black', 'gold'],
    filters: { cpu: 'Apple M4', ram: '۱۶ گیگابایت', storage: '۲۵۶ گیگابایت', gpu: 'Apple GPU', screen: '۱۳.۳ اینچ' },
    desc: 'مک‌بوک ایر M4 بدون فن، فوق‌العاده سبک و با عمر باتری تا ۱۸ ساعت، بهترین انتخاب برای کارهای روزمره، برنامه‌نویسی و طراحی سبک است.',
    features: ['بدنه بدون فن و کاملاً بی‌صدا', 'باتری تا ۱۸ ساعت', 'نمایشگر Liquid Retina']
  },
  {
    id: 'rog-strix-g16', name: 'لپ‌تاپ گیمینگ ایسوس ROG Strix G16 با RTX 4070',
    brand: 'Asus', cat: 'laptop', sub: 'gaming-laptop', price: 94000000, old: 108000000,
    stock: 4, rating: 4.7, reviews: 97, art: 'laptop', tags: ['amazing', 'recommended'],
    colors: ['black', 'graphite'],
    filters: { cpu: 'Core i9', ram: '۳۲ گیگابایت', storage: '۱ ترابایت', gpu: 'RTX 4070', screen: '۱۶ اینچ' },
    desc: 'ROG Strix G16 با نمایشگر ۱۶ اینچی ۱۶۵ هرتز، خنک‌کننده فلزی و کارت گرافیک RTX 4070، برای اجرای بازی‌های سنگین و رندر حرفه‌ای ساخته شده است.',
    features: ['نمایشگر ۱۶ اینچ ۱۶۵ هرتز', 'سیستم خنک‌کننده فلزی', 'کیبورد RGB با نورپردازی']
  },
  {
    id: 'vivobook-15', name: 'لپ‌تاپ ۱۵.۶ اینچی ایسوس Vivobook 15 با Core i5',
    brand: 'Asus', cat: 'laptop', sub: 'asus-laptop', price: 32900000, old: 38000000,
    stock: 19, rating: 4.4, reviews: 143, art: 'laptop',
    colors: ['silver', 'black'],
    filters: { cpu: 'Core i5', ram: '۱۶ گیگابایت', storage: '۵۱۲ گیگابایت', gpu: 'Intel Iris Xe', screen: '۱۵.۶ اینچ' },
    desc: 'ویووبوک ۱۵ با بدنه باریک، صفحه‌کلید کامل با ماشین‌حساب و نمایشگر NanoEdge، لپ‌تاپی متعادل برای کار اداری و دانشجویی است.',
    features: ['نمایشگر NanoEdge با حاشیه باریک', 'حافظه SSD پرسرعت', 'کیبورد کامل با نور پس‌زمینه']
  },
  {
    id: 'legion-5-pro', name: 'لپ‌تاپ گیمینگ لنوو Legion 5 Pro با RTX 4060',
    brand: 'Lenovo', cat: 'laptop', sub: 'lenovo', price: 61500000, old: 69000000,
    stock: 8, rating: 4.7, reviews: 88, art: 'laptop', tags: ['recommended'],
    colors: ['graphite'],
    filters: { cpu: 'Ryzen 7', ram: '۱۶ گیگابایت', storage: '۱ ترابایت', gpu: 'RTX 4060', screen: '۱۶ اینچ' },
    desc: 'لژیون 5 پرو با نمایشگر ۱۶ اینچی WQXGA و نسبت تصویر ۱۶:۱۰، تعادل خوبی بین قدرت گیمینگ و کار حرفه‌ای برقرار می‌کند.',
    features: ['نمایشگر WQXGA ۱۶ اینچ', 'کارت گرافیک RTX 4060', 'باتری ۸۰ وات‌ساعت']
  },
  {
    id: 'ideapad-slim-3', name: 'لپ‌تاپ ۱۵.۶ اینچی لنوو IdeaPad Slim 3',
    brand: 'Lenovo', cat: 'laptop', sub: 'student', price: 19800000, old: 23500000,
    stock: 27, rating: 4.2, reviews: 305, art: 'laptop', tags: ['bestseller', 'amazing'],
    colors: ['gray', 'blue'],
    filters: { cpu: 'Ryzen 5', ram: '۸ گیگابایت', storage: '۲۵۶ گیگابایت', gpu: 'Radeon Graphics', screen: '۱۵.۶ اینچ' },
    desc: 'آیدیاپد اسلیم 3 گزینه اقتصادی دانشجویی با بدنه سبک، باتری مناسب و پورت‌های کامل است.',
    features: ['بدنه ۱.۶ کیلوگرمی', 'شارژ سریع ۶۵ وات', 'پورت HDMI و USB-C']
  },
  {
    id: 'hp-pavilion-15', name: 'لپ‌تاپ ۱۵.۶ اینچی اچ‌پی Pavilion 15 با Core i7',
    brand: 'HP', cat: 'laptop', sub: 'hp', price: 27400000, old: 31000000,
    stock: 13, rating: 4.4, reviews: 162, art: 'laptop',
    colors: ['silver'],
    filters: { cpu: 'Core i7', ram: '۱۶ گیگابایت', storage: '۵۱۲ گیگابایت', gpu: 'Intel Iris Xe', screen: '۱۵.۶ اینچ' },
    desc: 'پاویلیون ۱۵ اچ‌پی با پردازنده Core i7 و حافظه ۱۶ گیگابایتی، برای کار اداری، مالی و مولتی‌تسکینگ روزمره طراحی شده است.',
    features: ['پردازنده Core i7 نسل جدید', 'صفحه‌کلید با ماشین‌حساب', 'وب‌کم HD با شاتر حریم خصوصی']
  },
  {
    id: 'macbook-pro-14-m4', name: 'لپ‌تاپ ۱۴ اینچی اپل MacBook Pro M4 Pro ظرفیت ۱ ترابایت',
    brand: 'Apple', cat: 'laptop', sub: 'apple-laptop', price: 129000000, old: 142000000,
    stock: 3, rating: 4.9, reviews: 74, art: 'laptop',
    colors: ['black', 'silver'],
    filters: { cpu: 'Apple M4', ram: '۳۲ گیگابایت', storage: '۱ ترابایت', gpu: 'Apple GPU', screen: '۱۴ اینچ' },
    desc: 'مک‌بوک پرو ۱۴ اینچی با نمایشگر Liquid Retina XDR و تراشه M4 Pro، ابزار حرفه‌ای تدوین، رندر و توسعه نرم‌افزار است.',
    features: ['نمایشگر Liquid Retina XDR', 'تراشه M4 Pro', 'پورت‌های Thunderbolt 5']
  },
  {
    id: 'tuf-gaming-a15', name: 'لپ‌تاپ گیمینگ ایسوس TUF Gaming A15 با RTX 4060',
    brand: 'Asus', cat: 'laptop', sub: 'gaming-laptop', price: 58900000, old: 66000000,
    stock: 6, rating: 4.5, reviews: 121, art: 'laptop',
    colors: ['graphite', 'black'],
    filters: { cpu: 'Ryzen 7', ram: '۱۶ گیگابایت', storage: '۵۱۲ گیگابایت', gpu: 'RTX 4060', screen: '۱۵.۶ اینچ' },
    desc: 'TUF Gaming A15 با استاندارد مقاومت نظامی، نمایشگر ۱۴۴ هرتز و سیستم خنک‌کننده خودتمیزشونده، گیمینگ بادوام را ممکن می‌کند.',
    features: ['استاندارد مقاومت MIL-STD', 'نمایشگر ۱۴۴ هرتز', 'خنک‌کننده خودتمیزشونده']
  },
  {
    id: 'dell-u2723qe', name: 'مانیتور ۲۷ اینچی دل UltraSharp U2723QE 4K',
    brand: 'Dell', cat: 'laptop', sub: 'monitor', price: 34500000, old: 39000000,
    stock: 10, rating: 4.6, reviews: 59, art: 'monitor', tags: ['recommended'],
    colors: ['silver'], filters: { screen: '۲۷ اینچ' },
    desc: 'مانیتور حرفه‌ای دل با پنل IPS Black، دقت 4K و پوشش رنگ گسترده، مناسب طراحی، تدوین و کار اداری دقیق.',
    features: ['پنل IPS Black با کنتراست بالا', 'دقت 4K و پوشش ۹۸٪ DCI-P3', 'هاب USB-C با پاور دلیوری ۹۰ وات']
  },
  {
    id: 'logitech-mx-master-3s', name: 'ماوس بی‌سیم لاجیتک MX Master 3S',
    brand: 'Logitech', cat: 'laptop', sub: 'mouse', price: 4890000, old: 5500000,
    stock: 41, rating: 4.8, reviews: 615, art: 'mouse', tags: ['bestseller'],
    colors: ['black', 'white'], filters: {},
    desc: 'MX Master 3S با سنسور ۸۰۰۰ DPI، چرخ اسکرول MagSpeed و اتصال سه‌دستگاهی، انتخاب اول کاربران حرفه‌ای است.',
    features: ['سنسور ۸۰۰۰ DPI', 'اتصال به سه دستگاه', 'باتری تا ۷۰ روز']
  },
  {
    id: 'logitech-mx-keys-s', name: 'کیبورد بی‌سیم لاجیتک MX Keys S با نور پس‌زمینه',
    brand: 'Logitech', cat: 'laptop', sub: 'keyboard', price: 4350000, old: 4900000,
    stock: 25, rating: 4.7, reviews: 204, art: 'keyboard',
    colors: ['graphite'], filters: {},
    desc: 'کیبورد MX Keys S با کلیدهای هم‌سطح و نور هوشمند، تایپ آرام و دقیقی برای کار طولانی فراهم می‌کند.',
    features: ['نور پس‌زمینه هوشمند', 'اتصال سه‌دستگاهی', 'باتری تا ۱۰ روز با نور']
  },

  /* ------------------------------- قطعات -------------------------------- */
  {
    id: 'intel-i7-14700k', name: 'پردازنده اینتل Core i7-14700K',
    brand: 'Intel', cat: 'parts', sub: 'cpu', price: 24800000, old: 28500000,
    stock: 12, rating: 4.7, reviews: 183, art: 'cpu', tags: ['recommended'],
    colors: ['silver'],
    filters: { family: 'پردازنده', socket: 'LGA 1700' },
    desc: 'پردازنده ۲۰ هسته‌ای اینتل با فرکانس توربو تا ۵.۶ گیگاهرتز، مناسب گیمینگ، رندر و کارهای سنگین چندرشته‌ای.',
    features: ['۲۰ هسته و ۲۸ رشته', 'فرکانس توربو ۵.۶ گیگاهرتز', 'پشتیبانی از DDR5 و PCIe 5.0']
  },
  {
    id: 'ryzen-7-9700x', name: 'پردازنده AMD Ryzen 7 9700X',
    brand: 'AMD', cat: 'parts', sub: 'cpu', price: 18900000, old: 21000000,
    stock: 15, rating: 4.6, reviews: 97, art: 'cpu', tags: ['new'],
    colors: ['silver'],
    filters: { family: 'پردازنده', socket: 'AM5' },
    desc: 'رایزن 7 9700X با معماری Zen 5 و بهره‌وری انرژی بالا، گزینه‌ای عالی برای سیستم‌های گیمینگ و تولید محتوا.',
    features: ['۸ هسته و ۱۶ رشته', 'معماری Zen 5', 'پشتیبانی از PCIe 5.0']
  },
  {
    id: 'asus-tuf-rtx-5070', name: 'کارت گرافیک ایسوس TUF Gaming GeForce RTX 5070 12GB',
    brand: 'Asus', cat: 'parts', sub: 'gpu', price: 62000000, old: 71000000,
    stock: 5, rating: 4.8, reviews: 61, art: 'gpu', tags: ['new', 'amazing'],
    colors: ['black'],
    filters: { family: 'کارت گرافیک', socket: 'PCIe 5.0' },
    desc: 'کارت گرافیک RTX 5070 با ۱۲ گیگابایت حافظه GDDR7 و فناوری DLSS 4، اجرای بازی‌های نسل جدید با تنظیمات بالا را ممکن می‌کند.',
    features: ['۱۲ گیگابایت GDDR7', 'پشتیبانی از DLSS 4', 'سیستم خنک‌کننده سه‌فن']
  },
  {
    id: 'msi-rtx-4070-super', name: 'کارت گرافیک ام‌اس‌آی GeForce RTX 4070 Super 12GB',
    brand: 'MSI', cat: 'parts', sub: 'gpu', price: 48500000, old: 56000000,
    stock: 7, rating: 4.7, reviews: 84, art: 'gpu',
    colors: ['black'],
    filters: { family: 'کارت گرافیک', socket: 'PCIe 4.0' },
    desc: 'RTX 4070 Super با معماری Ada Lovelace و ۱۲ گیگابایت حافظه، انتخاب متعادلی برای گیمینگ 1440p است.',
    features: ['۱۲ گیگابایت GDDR6X', 'ردیاب پرتو نسل سوم', 'خنک‌کننده Twin Frozr']
  },
  {
    id: 'samsung-990-pro-1tb', name: 'حافظه SSD سامسونگ 990 PRO ظرفیت ۱ ترابایت',
    brand: 'Samsung', cat: 'parts', sub: 'ssd', price: 7400000, old: 8300000,
    stock: 38, rating: 4.9, reviews: 512, art: 'ssd', tags: ['bestseller'],
    colors: ['black'],
    filters: { family: 'حافظه SSD', capacity: '۱ ترابایت', socket: 'PCIe 4.0' },
    desc: 'اس‌اس‌دی 990 پرو با سرعت خواندن تا ۷۴۵۰ مگابایت بر ثانیه، مناسب سیستم‌های گیمینگ و رندر حرفه‌ای است.',
    features: ['سرعت خواندن تا ۷۴۵۰ مگابایت', 'فرم‌فاکتور M.2 2280', 'گارانتی ۵ ساله']
  },
  {
    id: 'kingston-fury-16gb', name: 'رم کینگستون Fury Beast DDR5 ظرفیت ۱۶ گیگابایت',
    brand: 'Kingston', cat: 'parts', sub: 'ram', price: 4900000, old: 5600000,
    stock: 44, rating: 4.7, reviews: 233, art: 'ram',
    colors: ['black'],
    filters: { family: 'رم', capacity: '۱۶ گیگابایت', socket: 'DDR5' },
    desc: 'ماژول حافظه DDR5 با فرکانس ۵۶۰۰ مگاهرتز و heatsink اختصاصی، پایداری بالا در بارهای سنگین ارائه می‌دهد.',
    features: ['فرکانس ۵۶۰۰ مگاهرتز', 'ولتاژ پایین و مصرف بهینه', 'سازگار با XMP 3.0']
  },
  {
    id: 'asus-prime-b650m', name: 'مادربرد ایسوس Prime B650M-A WiFi',
    brand: 'Asus', cat: 'parts', sub: 'motherboard', price: 9800000, old: 11200000,
    stock: 16, rating: 4.5, reviews: 71, art: 'motherboard',
    colors: ['black'],
    filters: { family: 'مادربرد', socket: 'AM5' },
    desc: 'مادربرد میکرو ATX با سوکت AM5، پشتیبانی DDR5 و وای‌فای داخلی، پایه‌ای مطمئن برای سیستم نسل جدید.',
    features: ['سوکت AM5 و DDR5', 'وای‌فای ۶ داخلی', 'اسلات M.2 با هیت‌سینک']
  },
  {
    id: 'deepcool-ak620', name: 'خنک‌کننده پردازنده دیپ‌کول AK620',
    brand: 'DeepCool', cat: 'parts', sub: 'cooler', price: 3600000, old: 4200000,
    stock: 23, rating: 4.6, reviews: 118, art: 'cooler',
    colors: ['silver', 'black'],
    filters: { family: 'خنک‌کننده', socket: 'LGA 1700' },
    desc: 'خنک‌کننده دوبرجی با شش لوله حرارتی و دو فن ۱۲۰ میلی‌متری، خنک‌سازی کم‌صدا و قدرتمند برای پردازنده‌های رده بالا.',
    features: ['شش لوله حرارتی', 'دو فن ۱۲۰ میلی‌متری', 'سازگار با سوکت‌های رایج']
  },
  {
    id: 'wd-blue-2tb', name: 'هارد دیسک وسترن دیجیتال Blue ظرفیت ۲ ترابایت',
    brand: 'WD', cat: 'parts', sub: 'hdd', price: 4200000, old: 4800000,
    stock: 21, rating: 4.6, reviews: 148, art: 'hdd',
    colors: ['silver'], filters: { family: 'هارد', capacity: '۲ ترابایت' },
    desc: 'هارد دیسک ۲ ترابایتی وسترن دیجیتال با سرعت ۷۲۰۰ دور، فضای مطمئن برای آرشیو فایل‌ها و بکاپ است.',
    features: ['ظرفیت ۲ ترابایت', 'سرعت چرخش ۷۲۰۰ دور', 'مناسب آرشیو و بکاپ']
  },

  /* ----------------------------- لوازم جانبی ----------------------------- */
  {
    id: 'airpods-pro-3', name: 'هندزفری بی‌سیم اپل AirPods Pro 3',
    brand: 'Apple', cat: 'accessories', sub: 'earbuds', price: 14900000, old: 16500000,
    stock: 18, rating: 4.8, reviews: 426, art: 'earbuds', tags: ['bestseller', 'recommended'],
    colors: ['white'],
    filters: { connection: 'بلوتوث', family: 'هندزفری' },
    desc: 'ایرپادز پرو ۳ با حذف نویز فعال نسل جدید، صدای فضایی و تراشه H3، تجربه شنیداری بی‌نظیری ارائه می‌دهد.',
    features: ['حذف نویز فعال (ANC)', 'صدای فضایی شخصی‌سازی‌شده', 'تا ۳۰ ساعت با کیس شارژ']
  },
  {
    id: 'sony-wh-1000xm6', name: 'هدفون بی‌سیم سونی WH-1000XM6',
    brand: 'Sony', cat: 'accessories', sub: 'headphones', price: 21500000, old: 24000000,
    stock: 9, rating: 4.9, reviews: 288, art: 'headphones', tags: ['new', 'recommended'],
    colors: ['black', 'silver'],
    filters: { connection: 'بلوتوث', family: 'هدفون' },
    desc: 'هدفون پرچم‌دار سونی با بهترین حذف نویز بازار، ۳۰ ساعت باتری و کدک LDAC، استاندارد طلایی هدفون‌های بی‌سیم است.',
    features: ['حذف نویز فعال پیشرو', 'باتری تا ۳۰ ساعت', 'پشتیبانی LDAC و Hi-Res']
  },
  {
    id: 'galaxy-buds3-pro', name: 'هندزفری بی‌سیم سامسونگ Galaxy Buds3 Pro',
    brand: 'Samsung', cat: 'accessories', sub: 'earbuds', price: 8900000, old: 10200000,
    stock: 26, rating: 4.6, reviews: 191, art: 'earbuds',
    colors: ['silver', 'black'],
    filters: { connection: 'بلوتوث', family: 'هندزفری' },
    desc: 'گلکسی بادز 3 پرو با طراحی جدید، صدای ۲۴ بیت و ترجمه هم‌زمان، همراه ایده‌آل گوشی‌های سامسونگ است.',
    features: ['صدای Hi-Fi 24 بیت', 'حذف نویز تطبیقی', 'مقاومت IP57']
  },
  {
    id: 'jbl-charge-6', name: 'اسپیکر بلوتوثی جی‌بی‌ال Charge 6',
    brand: 'JBL', cat: 'accessories', sub: 'speaker', price: 9700000, old: 11000000,
    stock: 14, rating: 4.7, reviews: 158, art: 'speaker', tags: ['recommended'],
    colors: ['black', 'blue', 'red'],
    filters: { connection: 'بلوتوث', family: 'اسپیکر' },
    desc: 'اسپیکر قابل حمل JBL Charge 6 با صدای قدرتمند، مقاومت IP67 و قابلیت شارژ گوشی، همراه سفر و طبیعت است.',
    features: ['باتری تا ۲۸ ساعت', 'مقاومت IP67 ضدآب و گردوغبار', 'پاوربانک داخلی برای شارژ گوشی']
  },
  {
    id: 'logitech-g-pro-x-2', name: 'هدست گیمینگ بی‌سیم لاجیتک G PRO X 2',
    brand: 'Logitech', cat: 'accessories', sub: 'gaming-headset', price: 12400000, old: 14000000,
    stock: 12, rating: 4.7, reviews: 132, art: 'headphones',
    colors: ['black'],
    filters: { connection: 'بی‌سیم', family: 'هدفون' },
    desc: 'هدست حرفه‌ای لاجیتک با درایورهای گرافیتی، اتصال بی‌سیم کم‌تأخیر و میکروفون حذف نویز، انتخاب گیمرهای رقابتی.',
    features: ['درایور ۵۰ میلی‌متری گرافیتی', 'اتصال بی‌سیم LIGHTSPEED', 'باتری تا ۵۰ ساعت']
  },
  {
    id: 'anker-737-charger', name: 'شارژر دیواری انکر 737 مدل GaNPrime 120W',
    brand: 'Anker', cat: 'accessories', sub: 'charger', price: 3200000, old: 3800000,
    stock: 52, rating: 4.6, reviews: 275, art: 'charger', tags: ['bestseller'],
    colors: ['black', 'white'],
    filters: { connection: 'سیمی', family: 'شارژر' },
    desc: 'شارژر ۱۲۰ واتی GaNPrime با سه پورت، لپ‌تاپ و سه دستگاه دیگر را هم‌زمان و سریع شارژ می‌کند.',
    features: ['توان ۱۲۰ وات', 'فناوری GaNPrime', 'سه پورت USB-C و USB-A']
  },
  {
    id: 'anker-555-hub', name: 'هاب USB-C انکر مدل 555 با ۸ پورت',
    brand: 'Anker', cat: 'accessories', sub: 'usb-hub', price: 2400000, old: 2900000,
    stock: 33, rating: 4.5, reviews: 164, art: 'hub',
    colors: ['gray'], filters: { connection: 'سیمی', family: 'هاب و تبدیل' },
    desc: 'هاب ۸ پورت انکر با خروجی HDMI 4K، پورت اترنت و پاور دلیوری، دفتر کار قابل حملی برای لپ‌تاپ می‌سازد.',
    features: ['۸ پورت کامل', 'HDMI با پشتیبانی 4K', 'پاور دلیوری ۸۵ وات']
  },
  {
    id: 'razer-seiren-v3', name: 'میکروفون استودیویی ریزر Seiren V3 Chroma',
    brand: 'Razer', cat: 'accessories', sub: 'microphone', price: 5900000, old: 6800000,
    stock: 8, rating: 4.6, reviews: 96, art: 'mic',
    colors: ['black'],
    filters: { connection: 'سیمی', family: 'میکروفون' },
    desc: 'میکروفون USB ریزر با الگوی قطبی قابل تنظیم، مانیتورینگ بی‌درنگ و نورپردازی Chroma، مناسب استریم و پادکست.',
    features: ['ضبط ۲۴ بیت / ۹۶ کیلوهرتز', 'نورپردازی Chroma', 'فیلتر پاپ داخلی']
  },
  {
    id: 'jbl-quantum-400', name: 'هدست گیمینگ جی‌بی‌ال Quantum 400',
    brand: 'JBL', cat: 'accessories', sub: 'gaming-headset', price: 4300000, old: 5100000,
    stock: 19, rating: 4.4, reviews: 143, art: 'headphones', tags: ['amazing'],
    colors: ['black'],
    filters: { connection: 'بی‌سیم', family: 'هدفون' },
    desc: 'هدست Quantum 400 با صدای فراگیر JBL QuantumSURROUND، میکروفون جهت‌دار و طراحی سبک برای جلسات طولانی بازی.',
    features: ['صدای فراگیر ۷.۱', 'میکروفون قابل جداشدن', 'درایور ۵۰ میلی‌متری']
  },

  /* -------------------------------- گجت --------------------------------- */
  {
    id: 'apple-watch-series-11', name: 'ساعت هوشمند اپل Watch Series 11 سایز ۴۶ میلی‌متر',
    brand: 'Apple', cat: 'wearables', sub: 'smartwatch', price: 32500000, old: 36000000,
    stock: 11, rating: 4.8, reviews: 214, art: 'smartwatch', tags: ['new', 'recommended'],
    colors: ['black', 'silver', 'pink'],
    filters: { batteryLife: '۲ روز', compat: 'فقط iOS' },
    desc: 'اپل واچ سری ۱۱ با نمایشگر همیشه روشن، پایش پیشرفته سلامت و تشخیص تصادف، سلامتی شما را شبانه‌روز زیر نظر دارد.',
    features: ['نمایشگر Always-On', 'پایش ECG و اکسیژن خون', 'مقاومت در برابر آب ۵۰ متر']
  },
  {
    id: 'galaxy-watch-8', name: 'ساعت هوشمند سامسونگ Galaxy Watch 8 سایز ۴۴ میلی‌متر',
    brand: 'Samsung', cat: 'wearables', sub: 'smartwatch', price: 15800000, old: 18000000,
    stock: 17, rating: 4.6, reviews: 187, art: 'smartwatch',
    colors: ['black', 'silver'],
    filters: { batteryLife: '۲ روز', compat: 'اندروید و iOS' },
    desc: 'گلکسی واچ 8 با Wear OS، سنسور ترکیب بدن و GPS دقیق، همراهی کامل برای ورزش و زندگی روزمره است.',
    features: ['سنسور ترکیب بدن', 'GPS دوباندی', 'پایش خواب و استرس']
  },
  {
    id: 'mi-band-10', name: 'مچ‌بند هوشمند شیائومی Smart Band 10',
    brand: 'Xiaomi', cat: 'wearables', sub: 'band', price: 1850000, old: 2200000,
    stock: 76, rating: 4.5, reviews: 903, art: 'band', tags: ['bestseller', 'amazing'],
    colors: ['black', 'white', 'pink'],
    filters: { batteryLife: '۱۴ روز', compat: 'اندروید و iOS' },
    desc: 'مچ‌بند شیائومی با نمایشگر AMOLED ۱.۷۲ اینچی، ۱۵۰ حالت ورزشی و باتری ۱۴ روزه، پرفروش‌ترین گجت پوشیدنی NEXORA.',
    features: ['نمایشگر AMOLED بزرگ', '۱۵۰ حالت ورزشی', 'باتری تا ۱۴ روز']
  },
  {
    id: 'apple-watch-ultra-3', name: 'ساعت هوشمند اپل Watch Ultra 3 تیتانیوم',
    brand: 'Apple', cat: 'wearables', sub: 'smartwatch', price: 58000000, old: 64000000,
    stock: 5, rating: 4.9, reviews: 83, art: 'smartwatch', tags: ['amazing'],
    colors: ['titanium', 'black'],
    filters: { batteryLife: '۲ روز', compat: 'فقط iOS' },
    desc: 'اپل واچ اولترا 3 با بدنه تیتانیومی، GPS دوباندی و مقاومت بالا، برای ورزش‌های سخت و ماجراجویی طراحی شده است.',
    features: ['بدنه تیتانیومی مقاوم', 'GPS دوباندی دقیق', 'تا ۷۲ ساعت در حالت کم‌مصرف']
  },
  {
    id: 'xiaomi-watch-s4', name: 'ساعت هوشمند شیائومی Watch S4',
    brand: 'Xiaomi', cat: 'wearables', sub: 'smartwatch', price: 4900000, old: 5700000,
    stock: 28, rating: 4.4, reviews: 246, art: 'smartwatch',
    colors: ['black', 'silver'],
    filters: { batteryLife: '۷ روز', compat: 'اندروید و iOS' },
    desc: 'شیائومی واچ S4 با نمایشگر AMOLED و باتری هفت‌روزه، گزینه‌ای اقتصادی با امکانات کامل سلامتی.',
    features: ['نمایشگر AMOLED ۱.۴۳ اینچ', 'تماس بلوتوثی', 'باتری تا ۷ روز']
  },
  {
    id: 'rayban-meta', name: 'عینک هوشمند ری‌بن متا Wayfarer',
    brand: 'Ray-Ban', cat: 'wearables', sub: 'smart-glasses', price: 29500000, old: 34000000,
    stock: 6, rating: 4.5, reviews: 57, art: 'glasses', tags: ['new'],
    colors: ['black'],
    filters: { batteryLife: '۱ روز', compat: 'اندروید و iOS' },
    desc: 'عینک هوشمند ری‌بن متا با دوربین ۱۲ مگاپیکسلی، بلندگوی داخلی و دستیار هوشمند، تجربه‌ای تازه از ثبت لحظه‌ها.',
    features: ['دوربین ۱۲ مگاپیکسل', 'ضبط ویدیو 1080p', 'بلندگوی اپن‌ایر']
  },
  {
    id: 'galaxy-smarttag2', name: 'ردیاب هوشمند سامسونگ Galaxy SmartTag2',
    brand: 'Samsung', cat: 'wearables', sub: 'tracker', price: 1250000, old: 1450000,
    stock: 64, rating: 4.4, reviews: 312, art: 'tracker',
    colors: ['black', 'white'],
    filters: { batteryLife: '۷ روز', compat: 'اندروید و iOS' },
    desc: 'ردیاب هوشمند سامسونگ با برد بلند و باتری یک‌ساله، کلیدها و کیف خود را همیشه پیدا می‌کنید.',
    features: ['برد تا ۱۲۰ متر', 'مقاومت IP67', 'زنگ هشدار از طریق اپلیکیشن']
  },

  /* ------------------------------- گیمینگ ------------------------------- */
  {
    id: 'ps5-slim', name: 'کنسول بازی سونی PlayStation 5 Slim دیجیتال',
    brand: 'Sony', cat: 'gaming', sub: 'playstation', price: 42000000, old: 46000000,
    stock: 10, rating: 4.9, reviews: 512, art: 'console', tags: ['bestseller', 'amazing'],
    colors: ['white'],
    filters: { platform: 'PlayStation 5', family: 'کنسول' },
    desc: 'پلی‌استیشن 5 اسلیم با SSD فوق‌سریع، خروجی 4K و دسته DualSense، نسل جدید گیمینگ را با حجمی کمتر ارائه می‌دهد.',
    features: ['SSD فوق‌سریع ۱ ترابایت', 'خروجی 4K تا ۱۲۰ فریم', 'دسته DualSense با لرزش لمسی']
  },
  {
    id: 'xbox-series-x', name: 'کنسول بازی مایکروسافت Xbox Series X 1TB',
    brand: 'Microsoft', cat: 'gaming', sub: 'xbox', price: 38500000, old: 43000000,
    stock: 7, rating: 4.7, reviews: 236, art: 'xbox',
    colors: ['black'],
    filters: { platform: 'Xbox Series', family: 'کنسول' },
    desc: 'ایکس‌باکس سری X با قدرت ۱۲ ترافلاپس، بارگذاری سریع و پشتیبانی از Game Pass، قدرتمندترین کنسول مایکروسافت است.',
    features: ['۱۲ ترافلاپس قدرت گرافیکی', 'SSD ۱ ترابایت', 'پشتیبانی از Quick Resume']
  },
  {
    id: 'switch-2', name: 'کنسول بازی نینتندو Switch 2',
    brand: 'Nintendo', cat: 'gaming', sub: 'nintendo', price: 34900000, old: 39000000,
    stock: 9, rating: 4.8, reviews: 198, art: 'nintendo', tags: ['new'],
    colors: ['black', 'red'],
    filters: { platform: 'Nintendo Switch', family: 'کنسول' },
    desc: 'نینتندو سوییچ 2 با نمایشگر بزرگ‌تر، دسته‌های Joy-Con 2 و پشتیبانی از بازی‌های نسل قبل، هیجان همراه را دوچندان می‌کند.',
    features: ['قابل استفاده خانگی و همراه', 'نمایشگر ۱۰۸۰p', 'Joy-Con 2 مغناطیسی']
  },
  {
    id: 'dualsense-edge', name: 'دسته بازی سونی DualSense Edge مخصوص PS5',
    brand: 'Sony', cat: 'gaming', sub: 'gamepad', price: 8900000, old: 10000000,
    stock: 13, rating: 4.6, reviews: 121, art: 'gamepad',
    colors: ['white', 'black'],
    filters: { platform: 'PlayStation 5', family: 'دسته بازی' },
    desc: 'دسته حرفه‌ای DualSense Edge با استیک‌های قابل تعویض، دکمه‌های پشتی و پروفایل‌های سفارشی، برای بازی رقابتی ساخته شده است.',
    features: ['استیک ماژولار قابل تعویض', 'دکمه‌های پشتی قابل تنظیم', 'کیف حمل اختصاصی']
  },
  {
    id: 'xbox-controller', name: 'دسته بازی مایکروسافت Xbox Wireless Controller',
    brand: 'Microsoft', cat: 'gaming', sub: 'gamepad', price: 4900000, old: 5600000,
    stock: 31, rating: 4.5, reviews: 402, art: 'gamepad', tags: ['bestseller'],
    colors: ['black', 'white', 'blue'],
    filters: { platform: 'Xbox Series', family: 'دسته بازی' },
    desc: 'دسته بی‌سیم ایکس‌باکس با طراحی ارگونومیک، دکمه اشتراک‌گذاری و اتصال بلوتوث به PC و موبایل.',
    features: ['اتصال بی‌سیم و بلوتوث', 'دکمه Share', 'سازگار با Xbox و PC']
  },
  {
    id: 'razer-iskur-v2', name: 'صندلی گیمینگ ریزر Iskur V2',
    brand: 'Razer', cat: 'gaming', sub: 'gaming-chair', price: 24500000, old: 29000000,
    stock: 4, rating: 4.6, reviews: 68, art: 'chair', tags: ['recommended'],
    colors: ['black', 'green'],
    filters: { platform: 'PC', family: 'صندلی گیمینگ' },
    desc: 'صندلی گیمینگ ریزر با حمایت کمری تطبیقی و بدنه ارگونومیک، نشستن طولانی و راحت را ممکن می‌کند.',
    features: ['حمایت کمری قابل تنظیم', 'روکش چرم مصنوعی بادوام', 'زیرپایی ۴ بعدی']
  },
  {
    id: 'quest-3s', name: 'هدست واقعیت مجازی متا Quest 3S ظرفیت ۱۲۸ گیگابایت',
    brand: 'Meta', cat: 'gaming', sub: 'vr', price: 21900000, old: 25000000,
    stock: 8, rating: 4.5, reviews: 104, art: 'vr', tags: ['new'],
    colors: ['white'],
    filters: { platform: 'همه پلتفرم‌ها', family: 'واقعیت مجازی' },
    desc: 'هدست Quest 3S با واقعیت ترکیبی، ردیابی دست و کتابخانه بزرگ بازی، ورود مقرون‌به‌صرفه به دنیای متاورس است.',
    features: ['واقعیت ترکیبی رنگی', 'ردیابی دست بدون کنترلر', 'کتابخانه بزرگ بازی']
  },
  {
    id: 'logitech-g502-hero', name: 'ماوس گیمینگ لاجیتک G502 HERO',
    brand: 'Logitech', cat: 'gaming', sub: 'gaming-accessories', price: 3650000, old: 4200000,
    stock: 46, rating: 4.7, reviews: 780, art: 'mouse', tags: ['bestseller', 'amazing'],
    colors: ['black'],
    filters: { platform: 'PC' },
    desc: 'ماوس افسانه‌ای G502 با سنسور HERO 25K، ۱۱ دکمه قابل برنامه‌ریزی و وزنه‌های تنظیم‌پذیر، انتخاب میلیون‌ها گیمر.',
    features: ['سنسور HERO 25K', '۱۱ دکمه قابل برنامه‌ریزی', 'وزنه‌های قابل تنظیم']
  },
  {
    id: 'fc26-ps5', name: 'بازی FC 26 نسخه PlayStation 5',
    brand: 'Sony', cat: 'gaming', sub: 'console-games', price: 4200000, old: 4600000,
    stock: 22, rating: 4.3, reviews: 88, art: 'generic',
    colors: ['black'],
    filters: { platform: 'PlayStation 5', family: 'بازی' },
    desc: 'نسخه جدید محبوب‌ترین بازی فوتبال جهان با گرافیک ارتقایافته و حالت‌های آنلاین تازه برای PS5.',
    features: ['نسخه فیزیکی PS5', 'پشتیبانی از حالت آنلاین', 'زبان انگلیسی']
  },

  /* ------------------------------- دوربین ------------------------------- */
  {
    id: 'canon-eos-r6-ii', name: 'دوربین بدون آینه کانن EOS R6 Mark II با لنز 24-105',
    brand: 'Canon', cat: 'cameras', sub: 'dslr', price: 118000000, old: 129000000,
    stock: 3, rating: 4.8, reviews: 42, art: 'camera', tags: ['recommended'],
    colors: ['black'],
    filters: { resolution: '۲۴ مگاپیکسل', family: 'دوربین عکاسی' },
    desc: 'دوربین فول‌فریم کانن با فوکوس خودکار هوشمند، فیلم‌برداری 4K 60p و لرزشگیر داخلی، ابزار حرفه‌ای عکاسان و فیلم‌سازان.',
    features: ['سنسور فول‌فریم ۲۴ مگاپیکسل', 'فیلم‌برداری 4K 60p', 'لرزشگیر ۵ محوره']
  },
  {
    id: 'sony-a7-iv', name: 'دوربین بدون آینه سونی Alpha 7 IV با لنز 28-70',
    brand: 'Sony', cat: 'cameras', sub: 'dslr', price: 145000000, old: 158000000,
    stock: 2, rating: 4.9, reviews: 37, art: 'camera', tags: ['amazing'],
    colors: ['black'],
    filters: { resolution: '۳۳ مگاپیکسل', family: 'دوربین عکاسی' },
    desc: 'سونی A7 IV با سنسور ۳۳ مگاپیکسلی، فوکوس چشمی بی‌نظیر و فیلم‌برداری 4K 60p، استانداردی برای ترکیب عکس و ویدیو.',
    features: ['سنسور ۳۳ مگاپیکسل فول‌فریم', 'فوکوس ردیابی چشم', 'فیلم‌برداری 4K 60p']
  },
  {
    id: 'gopro-hero-13', name: 'دوربین ورزشی گوپرو Hero 13 Black',
    brand: 'GoPro', cat: 'cameras', sub: 'action-cam', price: 18500000, old: 21000000,
    stock: 12, rating: 4.6, reviews: 96, art: 'actioncam', tags: ['bestseller'],
    colors: ['black'],
    filters: { resolution: '۴K', family: 'دوربین ورزشی' },
    desc: 'گوپرو هیرو 13 بلک با فیلم‌برداری 5.3K، لرزشگیر HyperSmooth و بدنه ضدآب، همراه ماجراجویی‌های شماست.',
    features: ['فیلم‌برداری 5.3K', 'لرزشگیر HyperSmooth', 'ضدآب تا ۱۰ متر']
  },
  {
    id: 'dji-osmo-pocket-3', name: 'دوربین DJI Osmo Pocket 3 با گیمبال ۳ محوره',
    brand: 'DJI', cat: 'cameras', sub: 'camcorder', price: 32000000, old: 36000000,
    stock: 6, rating: 4.7, reviews: 71, art: 'camcorder', tags: ['recommended'],
    colors: ['black'],
    filters: { resolution: '۴K' },
    desc: 'پاکت 3 با سنسور ۱ اینچی و گیمبال مکانیکی، ویدیوهای سینمایی پایدار در جیب شما می‌سازد.',
    features: ['سنسور ۱ اینچی', 'گیمبال ۳ محوره', 'نمایشگر چرخان ۲ اینچ']
  },
  {
    id: 'canon-rf-50mm', name: 'لنز کانن RF 50mm f/1.8 STM',
    brand: 'Canon', cat: 'cameras', sub: 'lens', price: 12800000, old: 14000000,
    stock: 9, rating: 4.8, reviews: 58, art: 'lens',
    colors: ['black'], filters: { family: 'لنز' },
    desc: 'لنز ۵۰ میلی‌متری با دیافراگم f/1.8، بوکه نرم و فوکوس سریع، اولین لنز ضروری هر عکاس فول‌فریم کانن.',
    features: ['دیافراگم f/1.8', 'فوکوس STM کم‌صدا', 'طراحی سبک و جمع‌وجور']
  },
  {
    id: 'xiaomi-cw500', name: 'دوربین نظارتی شیائومی Outdoor Camera CW500',
    brand: 'Xiaomi', cat: 'cameras', sub: 'security-cam', price: 3400000, old: 4000000,
    stock: 24, rating: 4.4, reviews: 129, art: 'securitycam',
    colors: ['white'],
    filters: { resolution: '۴K', family: 'دوربین نظارتی' },
    desc: 'دوربین مداربسته شیائومی با کیفیت 4K، دید در شب رنگی و تشخیص حرکت هوشمند، امنیت خانه را تأمین می‌کند.',
    features: ['کیفیت 4K', 'دید در شب رنگی', 'مقاومت IP66']
  },
  {
    id: 'samsung-evo-plus-256', name: 'کارت حافظه سامسونگ EVO Plus ظرفیت ۲۵۶ گیگابایت',
    brand: 'Samsung', cat: 'cameras', sub: 'memory-card', price: 1900000, old: 2300000,
    stock: 55, rating: 4.7, reviews: 318, art: 'generic',
    colors: ['white'], filters: {},
    desc: 'کارت حافظه microSD با سرعت خواندن ۱۳۰ مگابایت، مناسب دوربین، گوشی و کنسول بازی.',
    features: ['ظرفیت ۲۵۶ گیگابایت', 'سرعت خواندن ۱۳۰ مگابایت', 'مقاوم در برابر آب و دما']
  },

  /* ---------------------------- صوتی و تصویری --------------------------- */
  {
    id: 'samsung-neo-qled-65', name: 'تلویزیون هوشمند سامسونگ Neo QLED 65 اینچ',
    brand: 'Samsung', cat: 'audio', sub: 'tv', price: 89000000, old: 99000000,
    stock: 6, rating: 4.7, reviews: 143, art: 'tv', tags: ['recommended'],
    colors: ['black'],
    filters: { screen: '۶۵ اینچ', family: 'تلویزیون' },
    desc: 'تلویزیون Neo QLED سامسونگ با نور پس‌زمینه Mini LED، نرخ ۱۴۴ هرتز و پردازنده هوش مصنوعی، تصویری خیره‌کننده ارائه می‌دهد.',
    features: ['فناوری Neo Quantum HDR', 'نرخ نوسازی ۱۴۴ هرتز', 'سیستم صوتی Dolby Atmos']
  },
  {
    id: 'lg-oled-c4-55', name: 'تلویزیون هوشمند ال‌جی OLED evo C4 55 اینچ',
    brand: 'LG', cat: 'audio', sub: 'tv', price: 76000000, old: 85000000,
    stock: 4, rating: 4.8, reviews: 87, art: 'tv', tags: ['amazing'],
    colors: ['black'],
    filters: { screen: '۵۵ اینچ', family: 'تلویزیون' },
    desc: 'تلویزیون OLED ال‌جی با مشکی مطلق، پردازنده α9 و پشتیبانی از ۱۲۰ هرتز VRR، انتخاب اول سینمای خانگی و گیمینگ.',
    features: ['پنل OLED evo', 'پردازنده α9 نسل جدید', '۴ پورت HDMI 2.1']
  },
  {
    id: 'sony-bravia-75', name: 'تلویزیون هوشمند سونی Bravia 7 سایز ۷۵ اینچ',
    brand: 'Sony', cat: 'audio', sub: 'tv', price: 132000000, old: 145000000,
    stock: 3, rating: 4.7, reviews: 42, art: 'tv',
    colors: ['black'],
    filters: { screen: '۷۵ اینچ', family: 'تلویزیون' },
    desc: 'براویا 7 سونی با پنل Mini LED و پردازنده XR، رنگ‌های طبیعی و جزئیات بالا را در ابعاد سینمایی نمایش می‌دهد.',
    features: ['پنل Mini LED', 'پردازنده XR Cognitive', 'سازگار با PS5']
  },
  {
    id: 'anker-nebula-cosmos', name: 'پروژکتور انکر Nebula Cosmos Laser 4K',
    brand: 'Anker', cat: 'audio', sub: 'projector', price: 24900000, old: 28500000,
    stock: 7, rating: 4.5, reviews: 63, art: 'projector', tags: ['new'],
    colors: ['gray'],
    filters: { family: 'پروژکتور' },
    desc: 'پروژکتور لیزری انکر با دقت 4K و روشنایی ۲۲۰۰ آنسی لومن، سینمای خانگی را بدون نیاز به لامپ تجربه می‌کنید.',
    features: ['منبع نور لیزری', 'دقت 4K HDR', 'فوکوس خودکار و تصحیح کلید']
  },
  {
    id: 'jbl-bar-1000', name: 'ساندبار جی‌بی‌ال Bar 1000 با ساب‌ووفر بی‌سیم',
    brand: 'JBL', cat: 'audio', sub: 'soundbar', price: 28500000, old: 32000000,
    stock: 5, rating: 4.6, reviews: 51, art: 'soundbar',
    colors: ['black'],
    filters: { family: 'ساندبار' },
    desc: 'ساندبار ۷.۱.۴ کاناله JBL با Dolby Atmos و دو بلندگوی قابل جدا شدن، صدای سینمایی را به اتاق شما می‌آورد.',
    features: ['سیستم ۷.۱.۴ کاناله', 'Dolby Atmos و DTS:X', 'ساب‌ووفر بی‌سیم ۱۰ اینچ']
  },
  {
    id: 'sony-ht-s40r', name: 'سینمای خانگی سونی HT-S40R 5.1 کاناله',
    brand: 'Sony', cat: 'audio', sub: 'home-theater', price: 19800000, old: 22500000,
    stock: 8, rating: 4.5, reviews: 74, art: 'theater',
    colors: ['black'],
    filters: { family: 'سینمای خانگی' },
    desc: 'سیستم ۵.۱ کاناله سونی با ساب‌ووفر و بلندگوهای بی‌سیم عقب، تجربه صدای فراگیر ساده و مقرون‌به‌صرفه.',
    features: ['۵.۱ کانال واقعی', 'بلندگوهای عقب بی‌سیم', 'اتصال HDMI ARC و بلوتوث']
  },

  /* -------------------------------- خانه -------------------------------- */
  {
    id: 'dyson-v15', name: 'جاروبرقی شارژی دایسون V15 Detect Absolute',
    brand: 'Dyson', cat: 'home', sub: 'vacuum', price: 42000000, old: 47000000,
    stock: 5, rating: 4.7, reviews: 118, art: 'vacuum', tags: ['recommended'],
    colors: ['gold', 'gray'],
    filters: { family: 'جاروبرقی' },
    desc: 'جاروبرقی دایسون V15 با موتور Hyperdymium و نمایشگر LCD که تعداد ذرات گردوغبار را نشان می‌دهد، نظافتی دقیق ارائه می‌کند.',
    features: ['نیروی مکش ۲۳۰ وات', 'نمایشگر LCD ذرات', 'تا ۶۰ دقیقه کارکرد']
  },
  {
    id: 'xiaomi-purifier-4-pro', name: 'تصفیه هوای شیائومی Smart Air Purifier 4 Pro',
    brand: 'Xiaomi', cat: 'home', sub: 'air-purifier', price: 12900000, old: 14500000,
    stock: 9, rating: 4.5, reviews: 87, art: 'purifier', tags: ['bestseller'],
    colors: ['white'],
    filters: { family: 'تصفیه هوا' },
    desc: 'تصفیه هوای شیائومی با فیلتر سه‌لایه و پوشش تا ۶۰ متر مربع، هوای تمیز و سالم را به خانه می‌آورد.',
    features: ['پوشش تا ۶۰ متر مربع', 'فیلتر HEPA سه‌لایه', 'کنترل با اپلیکیشن']
  },
  {
    id: 'dyson-purifier-hotcool', name: 'تصفیه هوا و بخاری دایسون Purifier Hot+Cool',
    brand: 'Dyson', cat: 'home', sub: 'air-purifier', price: 38000000, old: 43000000,
    stock: 4, rating: 4.6, reviews: 46, art: 'purifier',
    colors: ['white', 'silver'],
    filters: { family: 'تصفیه هوا' },
    desc: 'دستگاه سه‌کاره دایسون: تصفیه هوا، گرمایش و خنک‌سازی در یک بدنه جمع‌وجور با کنترل هوشمند.',
    features: ['سه کارکرد تصفیه، گرما و سرما', 'فیلتر HEPA H13', 'کنترل با اپلیکیشن']
  },
  {
    id: 'philips-airfryer', name: 'سرخ‌کن بدون روغن فیلیپس Airfryer سری 5000',
    brand: 'Philips', cat: 'home', sub: 'kitchen', price: 7400000, old: 8500000,
    stock: 16, rating: 4.5, reviews: 213, art: 'kitchen',
    colors: ['black', 'white'],
    filters: { family: 'لوازم آشپزخانه', capacity: '۴ لیتر' },
    desc: 'سرخ‌کن فیلیپس با ظرفیت ۴ لیتر و فناوری Rapid Air، غذای ترد با روغن بسیار کم آماده می‌کند.',
    features: ['ظرفیت ۴ لیتر', 'فناوری Rapid Air', 'قطعات قابل شست‌وشو در ماشین']
  },
  {
    id: 'xiaomi-robot-vacuum-s20', name: 'جاروبرقی رباتیک شیائومی Robot Vacuum S20',
    brand: 'Xiaomi', cat: 'home', sub: 'vacuum', price: 21000000, old: 24000000,
    stock: 11, rating: 4.4, reviews: 102, art: 'vacuum',
    colors: ['white', 'black'],
    filters: { family: 'جاروبرقی' },
    desc: 'جاروبرقی رباتیک شیائومی با مکش ۵۰۰۰ پاسکال و نقشه‌برداری لیزری، نظافت خودکار خانه را ممکن می‌کند.',
    features: ['مکش ۵۰۰۰ پاسکال', 'نقشه‌برداری LiDAR', 'کنترل از اپلیکیشن']
  }
];

/* ------------------------------ شبکه و اداری ---------------------------- */
RAW_PRODUCTS.push(
  {
    id: 'tplink-archer-ax55', name: 'روتر بی‌سیم تی‌پی-لینک Archer AX55',
    brand: 'TP-Link', cat: 'network', sub: 'router', price: 3900000, old: 4500000,
    stock: 23, rating: 4.6, reviews: 189, art: 'router', tags: ['bestseller'],
    colors: ['black'],
    filters: { family: 'روتر', speed: 'AX3000' },
    desc: 'روتر وای‌فای ۶ با سرعت AX3000، پوشش گسترده و پورت USB، شبکه‌ای پایدار برای خانه و دفتر کوچک می‌سازد.',
    features: ['وای‌فای ۶ با سرعت ۳۰۰۰ مگابیت', '۴ آنتن با فناوری Beamforming', 'کنترل والدین و مهمان']
  },
  {
    id: 'tplink-deco-x50', name: 'سیستم وای‌فای مش تی‌پی-لینک Deco X50 بسته ۲ عددی',
    brand: 'TP-Link', cat: 'network', sub: 'wifi', price: 6800000, old: 7800000,
    stock: 15, rating: 4.5, reviews: 96, art: 'router', tags: ['recommended'],
    colors: ['white'],
    filters: { speed: 'AX3000' },
    desc: 'مش وای‌فای ۶ با پوشش تا ۳۵۰ متر مربع و جابه‌جایی بدون قطعی بین واحدها، راه‌حلی کامل برای خانه‌های بزرگ.',
    features: ['پوشش تا ۳۵۰ متر مربع', 'وای‌فای ۶ AX3000', 'مدیریت با اپلیکیشن Deco']
  },
  {
    id: 'epson-l3250', name: 'پرینتر سه‌کاره اپسون EcoTank L3250',
    brand: 'Epson', cat: 'network', sub: 'printer', price: 8900000, old: 9800000,
    stock: 7, rating: 4.4, reviews: 61, art: 'printer',
    colors: ['black'],
    filters: { family: 'پرینتر' },
    desc: 'پرینتر سه‌کاره اپسون با مخزن جوهر قابل شارژ و وای‌فای داخلی، هزینه چاپ بسیار پایینی برای دفتر کار دارد.',
    features: ['چاپ، اسکن و کپی', 'مخزن جوهر با بازده بالا', 'چاپ بی‌سیم از موبایل']
  },
  {
    id: 'tplink-sg108', name: 'سوییچ شبکه تی‌پی-لینک TL-SG108 ۸ پورت',
    brand: 'TP-Link', cat: 'network', sub: 'switch', price: 2100000, old: 2400000,
    stock: 29, rating: 4.6, reviews: 74, art: 'switchnet',
    colors: ['black'],
    filters: { family: 'سوییچ', speed: 'گیگابیتی' },
    desc: 'سوییچ ۸ پورت گیگابیتی فلزی با نصب آسان و عملکرد پایدار، توسعه شبکه سیمی را ساده می‌کند.',
    features: ['۸ پورت گیگابیتی', 'بدنه فلزی مقاوم', 'نصب Plug and Play']
  },
  {
    id: 'synology-ds223j', name: 'ذخیره‌ساز شبکه سینولوژی DiskStation DS223j',
    brand: 'Synology', cat: 'network', sub: 'nas', price: 32000000, old: 35000000,
    stock: 3, rating: 4.5, reviews: 28, art: 'nas', tags: ['recommended'],
    colors: ['black'],
    filters: { family: 'ذخیره‌سازی شبکه' },
    desc: 'NAS دو‌بیزی سینولوژی برای بکاپ، اشتراک فایل و سرور رسانه خانگی، با نرم‌افزار قدرتمند DSM.',
    features: ['پشتیبانی از ۲ هارد', 'نرم‌افزار DSM', 'بکاپ خودکار و رمزنگاری']
  }
);

/* -------------------------------------------------------------------------- */
/*  Normalization                                                             */
/* -------------------------------------------------------------------------- */
const NX_WARRANTY = {
  mobile: ['۱۸ ماه گارانتی شرکتی', 'گارانتی طلایی NEXORA'],
  laptop: ['۱۸ ماه گارانتی شرکتی', 'گارانتی طلایی NEXORA'],
  parts: ['۳۶ ماه گارانتی شرکتی', 'گارانتی طلایی NEXORA'],
  accessories: ['۱۲ ماه گارانتی', 'گارانتی طلایی NEXORA'],
  wearables: ['۱۲ ماه گارانتی', 'گارانتی طلایی NEXORA'],
  gaming: ['۱۲ ماه گارانتی', 'گارانتی طلایی NEXORA'],
  cameras: ['۱۸ ماه گارانتی شرکتی', 'گارانتی طلایی NEXORA'],
  audio: ['۱۸ ماه گارانتی شرکتی', 'گارانتی طلایی NEXORA'],
  home: ['۱۲ ماه گارانتی', 'گارانتی طلایی NEXORA'],
  network: ['۱۲ ماه گارانتی', 'گارانتی طلایی NEXORA']
};

function nxBrandColor(name) {
  const b = BRANDS.find((x) => x.name === name);
  return b ? b.color : '#5B45E8';
}

function normalizeProduct(raw, index) {
  const cat = typeof getCategory === 'function' ? getCategory(raw.cat) : null;
  const subs = cat ? cat.subs : [];
  const sub = subs.find((s) => s.id === raw.sub);
  const old = raw.old && raw.old > raw.price ? raw.old : 0;
  const discount = old ? Math.round((1 - raw.price / old) * 100) : 0;
  const colors = (raw.colors && raw.colors.length ? raw.colors : ['black']).map((c) => {
    if (typeof c !== 'string') return c;
    if (NX_COLORS[c]) return NX_COLORS[c];
    const byPersianName = Object.values(NX_COLORS).find((preset) => preset.name === c);
    return byPersianName || { name: c, hex: '#5B45E8' };
  });

  const filterSpecs = {};
  Object.entries(raw.filters || {}).forEach(([key, value]) => {
    if (value) filterSpecs[NX_FILTER_LABELS[key] || key] = value;
  });

  const specs = {
    'برند': raw.brand,
    'دسته‌بندی': cat ? cat.name : '',
    'نوع محصول': sub ? sub.name : '',
    ...filterSpecs,
    ...(raw.specs || {})
  };

  return {
    id: raw.id,
    sku: 'NX-' + String(1001 + index),
    name: raw.name,
    brand: raw.brand,
    brandColor: nxBrandColor(raw.brand),
    cat: raw.cat,
    catName: cat ? cat.name : '',
    sub: raw.sub || '',
    subName: sub ? sub.name : '',
    price: raw.price,
    oldPrice: old,
    discount,
    stock: raw.stock ?? 0,
    rating: raw.rating ?? 4.5,
    reviews: raw.reviews ?? 0,
    art: raw.art || 'generic',
    accent: raw.accent || nxBrandColor(raw.brand),
    tags: raw.tags || [],
    colors,
    warranties: raw.warranties || NX_WARRANTY[raw.cat] || ['۱۲ ماه گارانتی'],
    filters: raw.filters || {},
    specs,
    desc: raw.desc || `${raw.name} یکی از محصولات منتخب فروشگاه NEXORA در دسته ${cat ? cat.name : ''} است. ${NX_CATEGORY_COPY[raw.cat] || ''}`,
    features: raw.features || NX_CATEGORY_FEATURES[raw.cat] || ['کیفیت ساخت بالا', 'گارانتی معتبر', 'ارسال سریع'],
    searchText: [
      raw.name, raw.brand, cat ? cat.name : '', cat ? cat.name.replace(/‌/g, ' ') : '',
      sub ? sub.name : '', ...(raw.tags || [])
    ].join(' ').toLowerCase(),
    isSample: true
  };
}

const PRODUCTS = RAW_PRODUCTS.map((p, i) => normalizeProduct(p, i));

const NX_STORE_KEYS = {
  products: 'nexora_admin_products',
  categories: 'nexora_admin_categories'
};

function nxRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function nxWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

/* Products edited/created in the admin panel override the base catalogue. */
function getProducts() {
  const custom = nxRead(NX_STORE_KEYS.products, null);
  if (Array.isArray(custom) && custom.length) return custom;
  return PRODUCTS;
}

function saveProducts(list) {
  nxWrite(NX_STORE_KEYS.products, list);
}

function resetProducts() {
  localStorage.removeItem(NX_STORE_KEYS.products);
}

function findProduct(id) {
  return getProducts().find((p) => p.id === id) || null;
}

function getCategoryFilters(catId) {
  return CATEGORY_FILTERS[catId] || [];
}

function productsByCategory(catId, subId) {
  return getProducts().filter((p) => p.cat === catId && (!subId || p.sub === subId));
}

function discountPercent(p) {
  if (!p.oldPrice || p.oldPrice <= p.price) return 0;
  return Math.round((1 - p.price / p.oldPrice) * 100);
}

/* Normalize arbitrary admin input into the same shape as the catalogue. */
function normalizeAdminProduct(raw) {
  const existing = findProduct(raw.id);
  if (existing) {
    const merged = { ...existing, ...raw };
    merged.discount = merged.oldPrice > merged.price ? Math.round((1 - merged.price / merged.oldPrice) * 100) : 0;
    const cat = getCategory(merged.cat);
    merged.catName = cat ? cat.name : merged.catName || '';
    const sub = cat ? cat.subs.find((s) => s.id === merged.sub) : null;
    merged.subName = sub ? sub.name : merged.subName || '';
    merged.specs = { ...(existing.specs || {}), ...(raw.specs || {}) };
    merged.searchText = [merged.name, merged.brand, merged.catName, merged.subName].join(' ').toLowerCase();
    return merged;
  }
  return normalizeProduct({ ...raw, old: raw.oldPrice || 0 }, getProducts().length);
}
