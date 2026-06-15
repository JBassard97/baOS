export function getAllCSSVariables() {
    const styles = getComputedStyle(document.documentElement);

    const vars: Record<string, string> = {};

    for (const key of styles) {
        if (key.startsWith("--")) {
            vars[key] = styles.getPropertyValue(key).trim();
        }
    }

    return vars;
}