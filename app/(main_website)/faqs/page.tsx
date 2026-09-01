import FaqsPageComponent from "@/components/pages/faqsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | Swing Rides",
  description:
    "Find answers to frequently asked questions about booking, renting, hosting, and managing vehicles on SwingRides.",
};

export default function FaqsPage() {
  return (
    <main>
      <FaqsPageComponent />
    </main>
  );
}
