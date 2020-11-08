export function IDGenerator(): string {
    return Math.random().toString(36).slice(2)
}