import { getEws23Countries } from "@/lib/ews";
import { EwsCalendarClient } from "@/components/EwsCalendarClient";

export default function EwsTakvimPage() {
  const countries = getEws23Countries();
  const todayStr = new Date().toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return <EwsCalendarClient countries={countries} todayStr={todayStr} />;
}
