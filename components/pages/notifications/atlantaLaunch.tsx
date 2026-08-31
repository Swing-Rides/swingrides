import Link from "next/link";

export default function AtlantaLaunch() {
    return (
        <div className="w-full px-5 py-3.5 bg-blue-700 text-center gap-2.5 overflow-hidden">
            <p className="text-white text-base font-semibold font-text">
                SwingRides is now in Atlanta.{" "}
                <Link 
                    className="underline hover:text-blue-200 duration-300 transition-all"
                    href={'/usa/georgia/atlanta'}
                >
                    Learn how SwingRides is serving Atlanta →
                </Link>
            </p>
        </div>
    )
}
