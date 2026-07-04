import { ReactNode } from "react";
import PageIntro from "@/components/superAdminPages/dashboard/pageIntro";

type PageWrapperProps = {
  pageTitle: string;
  pageDescription: string;
  pageButton?: ReactNode;
  children: ReactNode;
};

export default function PageWrapper({
  pageTitle,
  pageDescription,
  pageButton,
  children,
}: PageWrapperProps) {
  return (
    <div className="p-3 md:p-8">
      <div>
        <div className="flex items-center justify-between">
          <PageIntro pageTitle={pageTitle} pageDesc={pageDescription} />
          {pageButton && <div>{pageButton}</div>}
        </div>

        {children}
      </div>
    </div>
  );
}
