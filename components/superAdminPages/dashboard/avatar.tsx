import Image from 'next/image'
import { getAvatarUrl } from '../utils/avatarUrl'

type AvatarProps = {
        name: string
        height?: number
        className?: string
}

export const Avatar = ({ name, height = 40, className }: AvatarProps) => {
        const src = getAvatarUrl(name)

        return (
                <Image
                        src={src}
                        alt={name}
                        title={name}
                        width={height}
                        height={height}
                        className={className}
                        unoptimized
                />
        )
}