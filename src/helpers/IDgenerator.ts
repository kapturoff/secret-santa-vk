export default function createID(): string {
    return Math.random().toString(36).slice(2)
}