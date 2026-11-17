import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
  accent?: boolean;
}

export function StatCard({ label, value, icon, trend, className, accent }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 flex items-start gap-3 shadow-sm sm:p-5 sm:gap-4 max-[360px]:flex-col max-[360px]:gap-2 max-[360px]:p-3",
        accent && "bg-primary border-primary",
        className
      )}
    >
      <div className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg sm:size-10 max-[360px]:size-8",
        accent ? "bg-primary-foreground/10 text-primary-foreground" : "bg-primary/10 text-primary"
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-xs font-medium sm:text-sm", accent ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {label}
        </p>
        <p className={cn("text-2xl font-bold leading-tight mt-0.5", accent ? "text-primary-foreground" : "text-foreground")}>
          {value}
        </p>
        {trend && (
          <p className={cn(
            "text-xs mt-1",
            accent
              ? "text-primary-foreground/70"
              : trend.positive ? "text-green-600" : "text-destructive"
          )}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
