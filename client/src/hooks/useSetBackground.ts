import { useUIStore } from "../store/useUIStore";

export function useSetBackground() {
    const setCurrentBackground = useUIStore(
        (state) => state.setCurrentBackground
    );

    const pickBackground = () => {
        const input = document.createElement("input");

        input.type = "file";
        input.accept = "image/*,video/*";

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            // 1. OPFS root
            const root = await navigator.storage.getDirectory();

            // 2. Create /Images
            const imagesDir = await root.getDirectoryHandle("Images", {
                create: true,
            });

            // 3. Create /Images/Backgrounds
            const backgroundsDir = await imagesDir.getDirectoryHandle("Backgrounds", {
                create: true,
            });

            // 4. Write file
            const handle = await backgroundsDir.getFileHandle(file.name, {
                create: true,
            });

            const writable = await handle.createWritable();
            await writable.write(file);
            await writable.close();

            // 5. Save path in Zustand (your "OS state")
            const path = `/Images/Backgrounds/${file.name}`;
            setCurrentBackground(path);
        };

        input.click();
    };

    return { pickBackground };
}