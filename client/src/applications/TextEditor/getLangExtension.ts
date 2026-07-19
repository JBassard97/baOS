import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { sass } from "@codemirror/lang-sass";
import { markdown } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { sql } from "@codemirror/lang-sql";
import { rust } from "@codemirror/lang-rust";
import { php } from "@codemirror/lang-php";

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
    svg: () => [html()],

    css: () => [css()],
    scss: () => [sass()],
    sass: () => [sass()],

    xml: () => [xml()],

    // Data
    json: () => [json()],
    geojson: () => [json()],

    // Markdown
    md: () => [markdown()],
    markdown: () => [markdown()],

    // Python
    py: () => [python()],

    // Java
    java: () => [java()],

    // C / C++
    c: () => [cpp()],
    h: () => [cpp()],
    cpp: () => [cpp()],
    cxx: () => [cpp()],
    cc: () => [cpp()],
    hpp: () => [cpp()],

    // Rust
    rs: () => [rust()],

    // PHP
    php: () => [php()],

    // SQL
    sql: () => [sql()],
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