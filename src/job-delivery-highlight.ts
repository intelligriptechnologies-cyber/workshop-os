import { useEffect, useState } from "react";
import type { JobCard } from "./types";

function calendarDay(value: string): number | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day)
    return undefined;
  return date.getTime() / 86_400_000;
}

export function localDeliveryDate(now = new Date()): string {
  const year = String(now.getFullYear()).padStart(4, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function jobDeliveryTone(
  job: Pick<JobCard, "estimated_delivery" | "main_status" | "archived_at">,
  today: string,
): "approaching" | "overdue" | undefined {
  if (job.archived_at || job.main_status === "CLOSED" || job.main_status === "CANCELLED") return undefined;
  const deliveryDay = calendarDay(job.estimated_delivery ?? "");
  const todayDay = calendarDay(today);
  if (deliveryDay === undefined || todayDay === undefined) return undefined;
  const daysAway = deliveryDay - todayDay;
  if (daysAway < 0) return "overdue";
  if (daysAway <= 7) return "approaching";
  return undefined;
}

export function jobDeliveryClass(job: Pick<JobCard, "estimated_delivery" | "main_status" | "archived_at">, today: string) {
  const tone = jobDeliveryTone(job, today);
  return tone ? `job-delivery-${tone}` : "";
}

export function useLocalDeliveryDate(): string {
  const [today, setToday] = useState(() => localDeliveryDate());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      setToday(localDeliveryDate());
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(refresh, Math.max(1, nextMidnight.getTime() - now.getTime() + 50));
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timer);
        refresh();
      }
    };
    refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return today;
}
