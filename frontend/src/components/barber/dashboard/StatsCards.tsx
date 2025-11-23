"use client";

import { Clock, CalendarDays, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: {
    today: number;
    todayCompleted: number;
    upcoming: number;
    totalAppointments: number;
    totalRevenue: number;
    todayRevenue: number;
    totalCustomers: number;
    totalServices: number;
  };
}

const colorClasses = {
  primary: {
    text: "text-primary",
    bg: "bg-primary/10",
    iconBg: "bg-primary/20",
  },
  info: {
    text: "text-info",
    bg: "bg-info/10",
    iconBg: "bg-info/10",
  },
  success: {
    text: "text-success",
    bg: "bg-success/10",
    iconBg: "bg-success/20",
  },
  brand: {
    text: "text-brand",
    bg: "bg-brand/10",
    iconBg: "bg-brand/20",
  },
};

function StatCard({
  title,
  value,
  icon: Icon,
  color = "primary",
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color?: "primary" | "info" | "success" | "brand";
  subtitle?: string;
}) {
  const colors = colorClasses[color];

  return (
    <Card className={cn("hover:shadow-md transition-shadow")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center",
            colors.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", colors.text)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", colors.text)}>{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsCards({ stats }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatCard
        title="Today's Schedule"
        value={stats.today}
        icon={CalendarDays}
        color="primary"
        subtitle={`${stats.todayCompleted} completed`}
      />
      <StatCard
        title="Upcoming"
        value={stats.upcoming}
        icon={Clock}
        color="info"
        subtitle={
          stats.upcoming === 1
            ? "appointment scheduled"
            : "appointments scheduled"
        }
      />
      <StatCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        icon={DollarSign}
        color="success"
        subtitle={`Today: ${formatCurrency(stats.todayRevenue)}`}
      />
      <StatCard
        title="Customers"
        value={stats.totalCustomers}
        icon={Users}
        color="brand"
        subtitle="total customers"
      />
    </div>
  );
}
