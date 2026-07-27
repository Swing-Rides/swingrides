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
                                className="text-nowrap py-2 px-6 rounded-xs text-xs bg-blue-700 text-white font-semibold capitalize hover:bg-blue-950 transition-colors duration-300 cursor-pointer"
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
                                className="text-nowrap py-2 px-6 rounded-xs text-xs bg-white text-neutral-950 font-semibold capitalize hover:bg-white/80 transition-colors duration-300 cursor-pointer"
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
                                className="text-nowrap py-2 px-6 rounded-xs text-xs bg-transparent text-white border border-solid border-white font-semibold capitalize hover:bg-black/80 transition-colors duration-300 cursor-pointer"
                        >
                                {btn.label}
                        </button>
                </Link>
        )
}

export { PriBtn, SecBtn, TetBtn }