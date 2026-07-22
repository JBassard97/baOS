const extensionMap: Record<string, () => Promise<any[]>> = {
    // JavaScript / TypeScript
    js: async () => {
        const { javascript } = await import("@codemirror/lang-javascript");
        return [javascript()];
    },

    mjs: async () => {
        const { javascript } = await import("@codemirror/lang-javascript");
        return [javascript()];
    },

    cjs: async () => {
        const { javascript } = await import("@codemirror/lang-javascript");
        return [javascript()];
    },

    jsx: async () => {
        const { javascript } = await import("@codemirror/lang-javascript");
        return [javascript({ jsx: true })];
    },

    ts: async () => {
        const { javascript } = await import("@codemirror/lang-javascript");
        return [javascript({ typescript: true })];
    },

    tsx: async () => {
        const { javascript } = await import("@codemirror/lang-javascript");

        return [
            javascript({
                jsx: true,
                typescript: true,
            }),
        ];
    },

    // Web
    html: async () => {
        const { html } = await import("@codemirror/lang-html");
        return [html()];
    },

    htm: async () => {
        const { html } = await import("@codemirror/lang-html");
        return [html()];
    },

    svg: async () => {
        const { html } = await import("@codemirror/lang-html");
        return [html()];
    },

    css: async () => {
        const { css } = await import("@codemirror/lang-css");
        return [css()];
    },

    scss: async () => {
        const { sass } = await import("@codemirror/lang-sass");
        return [sass()];
    },

    sass: async () => {
        const { sass } = await import("@codemirror/lang-sass");
        return [sass()];
    },

    xml: async () => {
        const { xml } = await import("@codemirror/lang-xml");
        return [xml()];
    },

    // Data
    json: async () => {
        const { json } = await import("@codemirror/lang-json");
        return [json()];
    },

    geojson: async () => {
        const { json } = await import("@codemirror/lang-json");
        return [json()];
    },

    // Markdown
    md: async () => {
        const { markdown } = await import("@codemirror/lang-markdown");
        return [markdown()];
    },

    markdown: async () => {
        const { markdown } = await import("@codemirror/lang-markdown");
        return [markdown()];
    },

    // Python
    py: async () => {
        const { python } = await import("@codemirror/lang-python");
        return [python()];
    },

    // Java
    java: async () => {
        const { java } = await import("@codemirror/lang-java");
        return [java()];
    },

    // C / C++
    c: async () => {
        const { cpp } = await import("@codemirror/lang-cpp");
        return [cpp()];
    },

    h: async () => {
        const { cpp } = await import("@codemirror/lang-cpp");
        return [cpp()];
    },

    cpp: async () => {
        const { cpp } = await import("@codemirror/lang-cpp");
        return [cpp()];
    },

    cxx: async () => {
        const { cpp } = await import("@codemirror/lang-cpp");
        return [cpp()];
    },

    cc: async () => {
        const { cpp } = await import("@codemirror/lang-cpp");
        return [cpp()];
    },

    hpp: async () => {
        const { cpp } = await import("@codemirror/lang-cpp");
        return [cpp()];
    },

    // Rust
    rs: async () => {
        const { rust } = await import("@codemirror/lang-rust");
        return [rust()];
    },

    // PHP
    php: async () => {
        const { php } = await import("@codemirror/lang-php");
        return [php()];
    },

    // SQL
    sql: async () => {
        const { sql } = await import("@codemirror/lang-sql");
        return [sql()];
    },
};

export async function getLanguageExtension(
    fileName?: string | null
): Promise<any[]> {
    if (!fileName) return [];

    const extension = fileName
        .split(".")
        .pop()
        ?.toLowerCase();

    if (!extension) return [];

    return (await extensionMap[extension]?.()) ?? [];
}