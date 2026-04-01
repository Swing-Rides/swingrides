import { link } from "fs"
import Link from "next/link"

type BtnProps = {
        btn: {
                link: string
                label: string
        }
}

const PriBtn = ({ btn }: BtnProps) => {
        return (
                <Link 
                        href={btn.link} 
                        title={btn.label}
                >
                        <button 
                                className="py-2 px-6 rounded-xs bg-[#1A56DB] text-white font-semibold capitalize hover:bg-[#1A56DB]/80 transition-colors duration-300 cursor-pointer"
                        >
                                {btn.label}
                        </button>
                </Link>
        )
}

const SecBtn = ({ btn }: BtnProps) => {
        return (
                <Link 
                        href={btn.link} 
                        title={btn.label}
                >
                        <button 
                                className="py-2 px-6 rounded-xs bg-white text-[#0B0B0B] font-semibold capitalize hover:bg-white/80 transition-colors duration-300 cursor-pointer"
                        >
                                {btn.label}
                        </button>
                </Link>
        )
}

const TetBtn = ({ btn }: BtnProps) => {
        return (
                <Link 
                        href={btn.link} 
                        title={btn.label}
                >
                        <button 
                                className="py-2 px-6 rounded-xs bg-transparent text-white border border-solid border-white font-semibold capitalize hover:bg-black/80 transition-colors duration-300 cursor-pointer"
                        >
                                {btn.label}
                        </button>
                </Link>
        )
}

export { PriBtn, SecBtn, TetBtn }