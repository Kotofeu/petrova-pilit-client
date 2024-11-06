export function classConnection(...classNames: (string | undefined)[]): string {
    return classNames.filter(className => !!className).join(' ');
}