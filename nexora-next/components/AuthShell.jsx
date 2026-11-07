import { BadgeCheck, RotateCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";
import Logo from "@/components/Logo";

const FEATURES = [
  { icon: Truck, title: "ارسال سریع", text: "تحویل تهران در همان روز" },
  { icon: ShieldCheck, title: "ضمانت اصالت", text: "گارانتی معتبر روی همه کالاها" },
  { icon: RotateCcw, title: "بازگشت ۷ روزه", text: "بدون قید و شرط" },
];

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="shell py-8">
      <div className="grid overflow-hidden rounded-[1.8rem] border border-line bg-white shadow-soft lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-ink p-8 text-white lg:block">
          <div className="absolute inset-0 nx-mesh opacity-80" />
          <div className="absolute inset-0 nx-grid-lines opacity-30" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 size-56 rounded-full bg-primary/40 blur-[90px]" />

          <div className="relative">
            <Logo tone="light" size="lg" showTagline />
            <h2 className="mt-10 text-[1.6rem] font-extrabold leading-9">
              به نکستورا خوش آمدید
              <br />
              <span className="bg-[linear-gradient(110deg,#C3B8FF,#FFFFFF)] bg-clip-text text-transparent">
                دنیای دیجیتال، یک قدم نزدیک‌تر
              </span>
            </h2>
            <p className="mt-3 max-w-sm text-[0.78rem] leading-7 text-white/60">
              با یک حساب کاربری، سفارش‌ها، علاقه‌مندی‌ها و آدرس‌هایتان را یکجا مدیریت کنید.
            </p>

            <ul className="mt-7 space-y-2.5">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2.5">
                  <span className="grid size-9 place-items-center rounded-xl bg-primary/25 text-[#C3B8FF]">
                    <feature.icon size={16} />
                  </span>
                  <span>
                    <span className="block text-[0.76rem] font-bold text-white">{feature.title}</span>
                    <span className="text-[0.64rem] text-white/50">{feature.text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <BadgeCheck size={18} className="text-[#9F92FF]" />
              <p className="text-[0.66rem] leading-6 text-white/55">
                این محیط نمایشی است؛ اطلاعات حساب شما فقط در همین مرورگر ذخیره می‌شود.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <div className="mx-auto max-w-sm">
            <div className="mb-5 lg:hidden">
              <Logo size="sm" />
            </div>
            <span className="chip bg-primary-soft text-primary">
              <Sparkles size={12} /> نکستورا
            </span>
            <h1 className="mt-2.5 text-[1.3rem] font-extrabold text-ink">{title}</h1>
            <p className="mt-1 text-[0.76rem] leading-6 text-muted">{subtitle}</p>
            <div className="mt-5">{children}</div>
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
