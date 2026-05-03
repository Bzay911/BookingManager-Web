import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../../../contexts/Authcontext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useBooking } from "../../../hooks/useBooking";
import { useLiveQueue } from "../../../hooks/useLiveQueue";
import type { QueueEntry } from "../queue/api/queueApi";

type BookingRecord = {
  scheduledAt: string;
  customer?: {
    displayName?: string | null;
  };
  service?: {
    service?: string | null;
    durationMinutes?: number | null;
    price?: number | null;
  };
};

function safeDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatHourLabel(baseDate: Date, hour: number) {
  return format(
    new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hour,
    ),
    "h a",
  );
}

function getBookingName(booking: BookingRecord) {
  return booking.customer?.displayName?.trim() || "Walk-in customer";
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const [now, setNow] = useState(() => Date.now());

  const { data: queueData = [], isLoading: queueLoading } = useLiveQueue(token);
  const { data: bookingData = [], isLoading: bookingsLoading } = useBooking(token);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const currentTime = new Date(now);
  const queue = Array.isArray(queueData) ? (queueData as QueueEntry[]) : [];
  const bookings = Array.isArray(bookingData) ? (bookingData as BookingRecord[]) : [];

  const currentServiceEntry = queue.find((entry) => entry.position === 1) ?? null;

  const todayBookings = bookings.filter((booking) => {
    const date = safeDate(booking.scheduledAt);
    return date ? isSameDay(date, currentTime) : false;
  });

  const business = user?.business;
  const openingHourRaw = business?.openingTime ? Number(business.openingTime.split(":")[0]) : 9;
  const closingHourRaw = business?.closingTime ? Number(business.closingTime.split(":")[0]) : 18;
  const openingHour = Number.isFinite(openingHourRaw) ? openingHourRaw : 9;
  const closingHour = Number.isFinite(closingHourRaw) ? Math.max(closingHourRaw, openingHour + 1) : 18;

  const hourlyBuckets = Array.from(
    { length: Math.min(closingHour - openingHour, 12) },
    (_, index) => openingHour + index,
  ).map((hour) => ({
    hour,
    count: todayBookings.filter((booking) => {
      const date = safeDate(booking.scheduledAt);
      return date ? date.getHours() === hour : false;
    }).length,
  }));

  const peakHour = hourlyBuckets.reduce(
    (best, bucket) => (bucket.count > best.count ? bucket : best),
    hourlyBuckets[0] ?? { hour: openingHour, count: 0 },
  );
  const chartData = hourlyBuckets.map((bucket) => ({
    hour: bucket.hour,
    label: formatHourLabel(currentTime, bucket.hour),
    bookings: bucket.count,
  }));

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
          {business?.businessName ?? "Your business"}
        </h1>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                <CheckCircle2 size={17} className="text-black" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gray-500">In service</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-black">
                  {queueLoading
                    ? "—"
                    : currentServiceEntry
                      ? getBookingName(currentServiceEntry.booking)
                      : "No one in service"}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {queueLoading
                    ? "Loading live queue"
                    : currentServiceEntry
                      ? `${currentServiceEntry.booking.service.service ?? "Service"} · ${currentServiceEntry.booking.service.durationMinutes ?? 0} min`
                      : "The queue is idle right now"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                <CalendarDays size={17} className="text-black" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gray-500">Bookings today</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-black">
                  {bookingsLoading ? "—" : String(todayBookings.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <CardHeader className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-semibold text-black">Today’s flow</CardTitle>
              <CardDescription className="mt-1 text-xs text-gray-500">
                Hourly booking density across your operating day.
              </CardDescription>
            </div>
            <div className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-medium text-black">
              Peak: {peakHour.count ? formatHourLabel(currentTime, peakHour.hour) : "No data yet"}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-5">
          {chartData.length ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ececec" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    interval={0}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    width={28}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    }}
                    labelStyle={{ color: "#111827", fontWeight: 600 }}
                    formatter={(value) => [
                      `${Number(value) || 0} booking${Number(value) === 1 ? "" : "s"}`,
                      "Bookings",
                    ]}
                  />
                  <Bar dataKey="bookings" fill="#0be48d" radius={[10, 10, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-52 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center">
              <div>
                <p className="text-sm font-medium text-gray-900">No bookings yet today</p>
                <p className="mt-1 text-xs text-gray-500">
                  Hourly demand will appear as soon as bookings are scheduled.
                </p>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
