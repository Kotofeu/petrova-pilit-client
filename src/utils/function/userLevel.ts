import { ANON_LEVEL_NAME, AVITO_LEVEL_NAME, AVITO_VALUE, HIGH_LEVEL_NAME, HIGH_LEVEL_VALUE, MEDIUM_LEVEL_NAME, MEDIUM_LEVEL_VALUE, START_LEVEL_NAME } from "../const/levels"

export function userLevel(visits: number | null): string {
    if (visits === AVITO_VALUE) return AVITO_LEVEL_NAME
    if (!visits) return ANON_LEVEL_NAME
    if (visits >= HIGH_LEVEL_VALUE) return HIGH_LEVEL_NAME
    if (visits >= MEDIUM_LEVEL_VALUE) return MEDIUM_LEVEL_NAME
    if (visits >= 0) return START_LEVEL_NAME
    return START_LEVEL_NAME
}