import { ReactNode } from "react";
import PageIntro from "./pageIntro"

type PageWrapperProps = {
        pageTitle: string;
        pageDescription: string;
        children: ReactNode
}

export default function PageWrapper({ pageTitle, pageDescription, children }: PageWrapperProps) {
        return (
                <div className='p-3 md:p-8'>
                        <div>
                                <PageIntro 
                                        pageTitle={pageTitle}
                                        pageDesc={pageDescription}
                                />

                                {children}
                        </div>
                </div>
        )
}
