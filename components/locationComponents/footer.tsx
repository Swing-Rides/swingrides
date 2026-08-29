import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SocialMediaIconLink from '@/components/footer/socialMediaIconLink';

export default function LocationFooter() {
        const currentYear = new Date().getFullYear();

        return (
                <footer className="w-full bg-[#F4F6F9] border-t border-slate-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10">
                                        {/* Brand Column */}
                                        <div className="md:col-span-4 lg:col-span-5 flex flex-col gap-4">
                                                <Link href="/" title="Swing Rides Home" className="flex items-center">
                                                        <Image
                                                                src="/swing-rides-logo.png"
                                                                alt="Swing Rides"
                                                                width={120}
                                                                height={60}
                                                                className="h-10 w-auto object-contain"
                                                        />
                                                </Link>
                                                <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
                                                        The smarter way to rent and manage your fleet. Connect directly with local car owners.
                                                </p>
                                                <div className="pt-2">
                                                        <SocialMediaIconLink />
                                                </div>
                                        </div>

                                        {/* Navigation Columns */}
                                        <div className="md:col-span-8 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
                                                {/* For Renters */}
                                                <div className="flex flex-col gap-3">
                                                        <h4 className="font-text font-bold text-sm text-slate-900 uppercase tracking-wider">
                                                                For Renters
                                                        </h4>
                                                        <ul className="flex flex-col gap-2.5 text-sm text-slate-600">
                                                                <li>
                                                                        <Link
                                                                                href="/browse-cars"
                                                                                className="hover:text-blue-700 transition-colors duration-200"
                                                                        >
                                                                                Browse Cars
                                                                        </Link>
                                                                </li>
                                                                <li>
                                                                        <Link
                                                                                href="/#how-it-works"
                                                                                className="hover:text-blue-700 transition-colors duration-200"
                                                                        >
                                                                                How It Works
                                                                        </Link>
                                                                </li>
                                                                <li>
                                                                        <Link
                                                                                href="/profile"
                                                                                className="hover:text-blue-700 transition-colors duration-200"
                                                                        >
                                                                                My Reservations
                                                                        </Link>
                                                                </li>
                                                        </ul>
                                                </div>

                                                {/* For Hosts */}
                                                <div className="flex flex-col gap-3">
                                                        <h4 className="font-text font-bold text-sm text-slate-900 uppercase tracking-wider">
                                                                For Hosts
                                                        </h4>
                                                        <ul className="flex flex-col gap-2.5 text-sm text-slate-600">
                                                                <li>
                                                                        <Link
                                                                                href="/for-hosts"
                                                                                className="hover:text-blue-700 transition-colors duration-200"
                                                                        >
                                                                                List Your Car
                                                                        </Link>
                                                                </li>
                                                                <li>
                                                                        <Link
                                                                                href="/us/host"
                                                                                className="hover:text-blue-700 transition-colors duration-200"
                                                                        >
                                                                                Host Dashboard
                                                                        </Link>
                                                                </li>
                                                                <li>
                                                                        <Link
                                                                                href="/for-hosts#how-it-works"
                                                                                className="hover:text-blue-700 transition-colors duration-200"
                                                                        >
                                                                                How It Works for Hosts
                                                                        </Link>
                                                                </li>
                                                                <li>
                                                                        <Link
                                                                                href="/for-hosts#price-list"
                                                                                className="hover:text-blue-700 transition-colors duration-200"
                                                                        >
                                                                                Pricing Plans
                                                                        </Link>
                                                                </li>
                                                        </ul>
                                                </div>

                                                {/* Help */}
                                                <div className="flex flex-col gap-3">
                                                        <h4 className="font-text font-bold text-sm text-slate-900 uppercase tracking-wider">
                                                                Help
                                                        </h4>
                                                        <ul className="flex flex-col gap-2.5 text-sm text-slate-600">
                                                                <li>
                                                                        <Link
                                                                                href="/contact-support"
                                                                                className="hover:text-blue-700 transition-colors duration-200"
                                                                        >
                                                                                Contact Support
                                                                        </Link>
                                                                </li>
                                                                <li>
                                                                        <Link
                                                                                href="/report-an-issue"
                                                                                className="hover:text-blue-700 transition-colors duration-200"
                                                                        >
                                                                                Report an Issue
                                                                        </Link>
                                                                </li>
                                                        </ul>
                                                </div>
                                        </div>
                                </div>

                                {/* Bottom Bar */}
                                <div className="pt-6 border-t border-slate-300/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                                        <div>
                                                <span>&copy; {currentYear} SwingRides. All rights reserved.</span>
                                        </div>

                                        <div className="flex items-center gap-6">
                                                <Link
                                                        href="/legal/privacy-policy"
                                                        className="hover:text-slate-900 transition-colors duration-200"
                                                >
                                                        Privacy Policy
                                                </Link>
                                                <Link
                                                        href="/legal/terms-and-conditions-of-use"
                                                        className="hover:text-slate-900 transition-colors duration-200"
                                                >
                                                        Terms of Service
                                                </Link>
                                        </div>
                                </div>
                        </div>
                </footer>
        );
}

