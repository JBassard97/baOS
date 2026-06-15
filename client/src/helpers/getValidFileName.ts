// Forces a file with no extension into .txt

export const getValidFileName = (name: string): string => {
    // Check if filename has a valid extension (dot followed by at least one character)
    const hasValidExtension = /\.[^.]+$/.test(name.trim());

    if (!hasValidExtension) {
        return `${name.trim()}.txt`;
    }

    return name.trim();
};