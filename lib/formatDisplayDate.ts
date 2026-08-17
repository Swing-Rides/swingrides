
export const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return undefined;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d
      .toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", " •");
  };
