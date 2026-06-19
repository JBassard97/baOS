import fileIcon from "../assets/icons/file-icon.svg";
import folderIcon from "../assets/icons/folder-icon.svg";
import jsIcon from "../assets/icons/javascript.svg";
import cssIcon from "../assets/icons/css.svg";
import htmlIcon from "../assets/icons/html.svg";
import cIcon from "../assets/icons/c.svg";
import tsIcon from "../assets/icons/typescript.svg";
import pyIcon from "../assets/icons/python.svg";
import sassIcon from "../assets/icons/sass.svg";
import svelteIcon from "../assets/icons/svelte.svg";
import vueIcon from "../assets/icons/vue.svg";
import jsonIcon from "../assets/icons/json.svg";
import javaIcon from "../assets/icons/java.svg";
import goIcon from "../assets/icons/go.svg";
import mdIcon from "../assets/icons/markdown.svg";

const iconMap: Record<string, string> = {
    ".html": htmlIcon,
    ".css": cssIcon,
    ".js": jsIcon,
    ".ts": tsIcon,
    ".c": cIcon,
    ".py": pyIcon,
    ".sass": sassIcon,
    ".scss": sassIcon,
    ".svelte": svelteIcon,
    ".vue": vueIcon,
    ".json": jsonIcon,
    ".java": javaIcon,
    ".go": goIcon,
    ".md": mdIcon,
}

export function getFileIcon(fileName: string, isDir: boolean) {

    if (isDir) return folderIcon;

    let output = fileIcon;

    for (const key in iconMap) {
        const typedKey = key as keyof typeof iconMap;

        if (fileName.endsWith(typedKey)) {
            output = iconMap[typedKey];
        }
    }

    return output;
}