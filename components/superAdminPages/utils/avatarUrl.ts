export const getAvatarUrl = (name: string): string => {
        const seed = encodeURIComponent(name.trim())
        return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}`
}