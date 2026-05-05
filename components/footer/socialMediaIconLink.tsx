import React from 'react'
import Link from 'next/link'

type SocialLinkProps = {
        href: string;
        label: string;
        children: React.ReactNode;
}

export default function SocialMediaIconLink() {
        return (
                <div className='flex items-center gap-3'>
                       <SocialLink 
                                href={'https://www.facebook.com/swingrides'}
                                label={'Click to visit our Facebook page'}
                        >
                                <FacebookIcon />
                        </SocialLink> 

                        <SocialLink 
                                href={'https://www.twitter.com/swingrides'}
                                label={'Click to visit our Twitter page'}
                        >
                                <TwitterIcon />
                        </SocialLink>

                        <SocialLink 
                                href={'https://www.instagram.com/swingrides'}
                                label={'Click to visit our Instagram page'}
                        >
                                <InstagramIcon />
                        </SocialLink>

                        <SocialLink 
                                href={'https://www.linkedin.com/company/swingrides'}
                                label={'Click to visit our LinkedIn page'}
                        >
                                <LinkedInIcon />
                        </SocialLink>
                </div>
        )
}

const SocialLink = ({ href, label, children }: SocialLinkProps ) => {
        return (
                <Link 
                        href={href}
                        title={label}
                >
                        {children}
                </Link>
        )
}

const FacebookIcon = () => {
        return (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 10C0 4.47716 4.47715 0 10 0H25.9946C31.5175 0 35.9946 4.47715 35.9946 10V25.9946C35.9946 31.5175 31.5175 35.9946 25.9946 35.9946H10C4.47716 35.9946 0 31.5175 0 25.9946V10Z" fill="#1A56DB" />
                        <path d="M21.9959 11.333H19.9965C19.1128 11.333 18.2652 11.6841 17.6403 12.309C17.0154 12.9339 16.6644 13.7814 16.6644 14.6652V16.6645H14.665V19.3303H16.6644V24.6618H19.3301V19.3303H21.3294L21.9959 16.6645H19.3301V14.6652C19.3301 14.4885 19.4003 14.3189 19.5253 14.194C19.6503 14.069 19.8198 13.9988 19.9965 13.9988H21.9959V11.333Z" stroke="white" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

        )
}

const TwitterIcon = () => {
        return (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 10C0 4.47716 4.47715 0 10 0H25.9946C31.5175 0 35.9946 4.47715 35.9946 10V25.9946C35.9946 31.5175 31.5175 35.9946 25.9946 35.9946H10C4.47716 35.9946 0 31.5175 0 25.9946V10Z" fill="#1A56DB" />
                        <g clipPath="url(#clip0_397_416)">
                                <path d="M24.6618 12.6659C24.6618 12.6659 24.1953 14.0654 23.3289 14.9318C24.3952 21.5961 17.0644 26.4611 11.333 22.6624C12.7992 22.7291 14.2653 22.2626 15.3316 21.3296C11.9994 20.3299 10.3333 16.3979 11.9994 13.3323C13.4656 15.065 15.7315 16.0647 17.9974 15.9981C17.3976 13.199 20.6632 11.5996 22.6625 13.4656C23.3955 13.4656 24.6618 12.6659 24.6618 12.6659Z" stroke="white" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                                <clipPath id="clip0_397_416">
                                        <rect width="15.9945" height="15.9945" fill="white" transform="translate(10 10)" />
                                </clipPath>
                        </defs>
                </svg>

        )
}

const InstagramIcon = () => {
        return (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 10C0 4.47716 4.47715 0 10 0H25.9946C31.5175 0 35.9946 4.47715 35.9946 10V25.9946C35.9946 31.5175 31.5175 35.9946 25.9946 35.9946H10C4.47716 35.9946 0 31.5175 0 25.9946V10Z" fill="#1A56DB" />
                        <g clipPath="url(#clip0_397_419)">
                                <path d="M21.3296 11.333H14.6652C12.8249 11.333 11.333 12.8249 11.333 14.6652V21.3296C11.333 23.1699 12.8249 24.6618 14.6652 24.6618H21.3296C23.1699 24.6618 24.6618 23.1699 24.6618 21.3296V14.6652C24.6618 12.8249 23.1699 11.333 21.3296 11.333Z" stroke="white" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20.663 17.5775C20.7453 18.1321 20.6505 18.6986 20.3923 19.1963C20.1341 19.694 19.7254 20.0975 19.2246 20.3496C18.7238 20.6017 18.1562 20.6895 17.6026 20.6004C17.049 20.5113 16.5376 20.2499 16.1411 19.8535C15.7447 19.457 15.4833 18.9456 15.3942 18.392C15.3051 17.8384 15.3929 17.2708 15.645 16.77C15.8971 16.2692 16.3006 15.8606 16.7983 15.6023C17.296 15.3441 17.8625 15.2493 18.4171 15.3316C18.9829 15.4155 19.5067 15.6791 19.9111 16.0835C20.3155 16.4879 20.5791 17.0117 20.663 17.5775Z" stroke="white" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M21.6631 14.332H21.6698" stroke="white" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                                <clipPath id="clip0_397_419">
                                        <rect width="15.9945" height="15.9945" fill="white" transform="translate(10 10)" />
                                </clipPath>
                        </defs>
                </svg>
  
        )
}

const LinkedInIcon = () => {
        return (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 10C0 4.47716 4.47715 0 10 0H25.9946C31.5175 0 35.9946 4.47715 35.9946 10V25.9946C35.9946 31.5175 31.5175 35.9946 25.9946 35.9946H10C4.47716 35.9946 0 31.5175 0 25.9946V10Z" fill="#1A56DB" />
                        <g clipPath="url(#clip0_397_424)">
                                <path d="M20.6627 15.3315C21.7232 15.3315 22.7403 15.7528 23.4902 16.5027C24.24 17.2526 24.6613 18.2697 24.6613 19.3302V23.9952H21.9956V19.3302C21.9956 18.9767 21.8551 18.6377 21.6052 18.3877C21.3552 18.1377 21.0162 17.9973 20.6627 17.9973C20.3092 17.9973 19.9702 18.1377 19.7202 18.3877C19.4702 18.6377 19.3298 18.9767 19.3298 19.3302V23.9952H16.6641V19.3302C16.6641 18.2697 17.0853 17.2526 17.8352 16.5027C18.5851 15.7528 19.6022 15.3315 20.6627 15.3315Z" stroke="white" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.9988 15.998H11.333V23.9953H13.9988V15.998Z" stroke="white" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12.6659 13.9988C13.402 13.9988 13.9988 13.402 13.9988 12.6659C13.9988 11.9298 13.402 11.333 12.6659 11.333C11.9298 11.333 11.333 11.9298 11.333 12.6659C11.333 13.402 11.9298 13.9988 12.6659 13.9988Z" stroke="white" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                                <clipPath id="clip0_397_424">
                                        <rect width="15.9945" height="15.9945" fill="white" transform="translate(10 10)" />
                                </clipPath>
                        </defs>
                </svg>

        )
}
