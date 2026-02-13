import { Users, TrendingUp, UserPlus, UserMinus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { summaryStats, trendData, allMembers } from "@/data/mock-data";
import { Link } from "react-router-dom";

const chartConfig = {
  members: { label: "Members", color: "hsl(var(--chart-1))" },
};

const statCards = [
  {
    title: "Total Attributed",
    value: summaryStats.totalActive,
    description: "Active members this month",
    icon: Users,
    color: "text-primary",
  },
  {
    title: "Net Change",
    value: `${summaryStats.netChange > 0 ? "+" : ""}${summaryStats.netChange}`,
    description: `vs. ${summaryStats.previousMonthTotal} last month`,
    icon: summaryStats.netChange >= 0 ? TrendingUp : TrendingUp,
    color: summaryStats.netChange >= 0 ? "text-primary" : "text-destructive",
  },
  {
    title: "New Members",
    value: summaryStats.newThisMonth,
    description: "Added this month",
    icon: UserPlus,
    color: "text-primary",
  },
  {
    title: "Removed Members",
    value: summaryStats.removedThisMonth,
    description: "Removed this month",
    icon: UserMinus,
    color: "text-destructive",
  },
];

const newMembers = allMembers.filter((m) => m.status === "new").slice(0, 5);
const removedMembers = allMembers.filter((m) => m.status === "removed").slice(0, 5);

export default function Index() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attribution Dashboard</h1>
        <p className="text-muted-foreground">February 2025 — Member Attribution Overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={cn("h-4 w-4", card.color)} />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", card.color)}>{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Attribution Trend</CardTitle>
          <CardDescription>Attributed member count over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart data={trendData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="fillMembers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} domain={["dataMin - 2", "dataMax + 2"]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="members"
                stroke="hsl(var(--chart-1))"
                fill="url(#fillMembers)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Change Highlights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recently Added</CardTitle>
              <CardDescription>New members this month</CardDescription>
            </div>
            <Link to="/changes" className="text-sm text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {newMembers.map((m) => (
              <Link key={m.id} to={`/patients/${m.id}`} className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent/50">
                <div>
                  <p className="font-medium">{m.lastName}, {m.firstName}</p>
                  <p className="text-sm text-muted-foreground">{m.memberId} · {m.plan.payer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-0">{m.changeReason}</Badge>
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recently Removed</CardTitle>
              <CardDescription>Members removed this month</CardDescription>
            </div>
            <Link to="/changes" className="text-sm text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {removedMembers.map((m) => (
              <Link key={m.id} to={`/patients/${m.id}`} className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent/50">
                <div>
                  <p className="font-medium">{m.lastName}, {m.firstName}</p>
                  <p className="text-sm text-muted-foreground">{m.memberId} · {m.plan.payer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="border-0">{m.changeReason}</Badge>
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
