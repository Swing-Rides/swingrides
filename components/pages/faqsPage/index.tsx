import FAQsSection from "@/components/faqs";
import { MessageSquare, LifeBuoy, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function FaqsPageComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <FAQsSection />
      <StillHaveQuestionsSection />
    </div>
  );
}

const StillHaveQuestionsSection = () => {
  return (
    <section className="py-12 px-4 md:px-20 md:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-8 md:p-12 text-white shadow-lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-700/60 rounded-full border border-blue-500/30 text-xs font-semibold uppercase tracking-wider text-blue-100">
                <LifeBuoy className="size-3.5" />
                <span>Support 24/7</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-bold font-sans">
                Still have questions?
              </h3>
              <p className="text-blue-100 text-sm md:text-base font-normal">
                Can&apos;t find the answer you&apos;re looking for? Our friendly support team is here to help you every step of the way.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/contact-support"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xs bg-white text-blue-900 font-semibold text-sm hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
              >
                <MessageSquare className="size-4 text-blue-700" />
                <span>Contact Support</span>
                <ArrowRight className="size-4 text-blue-700" />
              </Link>
              <Link
                href="/report-an-issue"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xs bg-blue-700/50 hover:bg-blue-700 border border-blue-400/30 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                <ShieldAlert className="size-4" />
                <span>Report an Issue</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
