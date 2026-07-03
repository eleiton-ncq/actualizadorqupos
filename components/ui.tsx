export function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-7">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#201a17]">{title}</h2>
          {description ? (
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[#7f6b60]">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-[#f2dfd1] bg-white shadow-[0_18px_55px_rgba(77,39,17,0.07)] ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  helper,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  helper?: string;
  icon?: React.ReactNode;
  tone?: "neutral" | "green" | "amber" | "blue" | "brand";
}) {
  const tones = {
    neutral: "bg-white",
    green: "bg-[#f1fbf6]",
    amber: "bg-[#fff8e8]",
    blue: "bg-[#f1f7ff]",
    brand: "bg-[#fff2e9]",
  };

  return (
    <Card className={`p-5 ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#7f6b60]">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-normal text-[#201a17]">
            {value}
          </p>
          {helper ? (
            <p className="mt-2 text-xs font-medium text-[#9a7b68]">{helper}</p>
          ) : null}
        </div>
        {icon ? (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white text-[#fd5b00] shadow-sm">
            {icon}
          </span>
        ) : null}
      </div>
    </Card>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#ffc9aa] bg-[#fff9f5] p-8 text-center text-sm font-medium text-[#7f6b60]">
      {message}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "amber" | "blue" | "brand";
}) {
  const tones = {
    neutral: "bg-[#f4eee9] text-[#584a43]",
    green: "bg-[#e4f8ee] text-[#166044]",
    amber: "bg-[#fff0bf] text-[#77500a]",
    blue: "bg-[#e9f3ff] text-[#19537a]",
    brand: "bg-[#ffe7d8] text-[#b13e00]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={`h-2.5 overflow-hidden rounded-full bg-[#fff0dc] ${className}`}>
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#fd5b00,#f7b231)]"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-[#fd5b00] px-4 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(253,91,0,0.24)] transition hover:bg-[#e24f00] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md border border-[#f3c27b] bg-white px-4 py-2.5 text-sm font-bold text-[#8a3500] shadow-sm transition hover:bg-[#fff7ef] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
