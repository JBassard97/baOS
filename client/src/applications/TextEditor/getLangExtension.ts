import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { sass } from "@codemirror/lang-sass";
import { markdown } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";

const extensionMap: Record<string, () => any[]> = {
    // JavaScript / TypeScript
    js: () => [javascript()],
    mjs: () => [javascript()],
    cjs: () => [javascript()],
    jsx: () => [javascript({ jsx: true })],

    ts: () => [javascript({ typescript: true })],

    tsx: () => [
        javascript({
            jsx: true,
            typescript: true,
        }),
    ],

    // Web
    html: () => [html()],
    htm: () => [html()],

    css: () => [css()],
    scss: () => [sass()],
    sass: () => [sass()],

    // Data
    json: () => [json()],

    // Markdown
    md: () => [markdown()],
    markdown: () => [markdown()],
};

export function getLanguageExtension(
    fileName?: string | null
) {
    if (!fileName) return [];

    const extension = fileName
        .split(".")
        .pop()
        ?.toLowerCase();

    if (!extension) return [];

    return extensionMap[extension]?.() ?? [];
}