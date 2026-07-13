self.addEventListener("install", () => {
  console.log("SW installed");
});

self.addEventListener("activate", (event) => {
  console.log("SW activated");

  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (!url.pathname.startsWith("/opfs/")) {
    return;
  }

  event.respondWith(handleOpfsRequest(url));
});

async function handleOpfsRequest(url) {
  try {
    const path = url.pathname.replace(/^\/opfs/, "");

    console.log("Serving OPFS file:", path);

    const file = await getFileFromPath(path);

    return new Response(file, {
      headers: {
        "Content-Type": getMimeType(file.name),
      },
    });
  } catch (err) {
    console.error("OPFS request failed:", err);

    return new Response("File not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}

function getMimeType(filename) {
  const ext = filename.split(".").pop()?.toLowerCase();

  const types = {
    html: "text/html",
    htm: "text/html",
    css: "text/css",
    js: "text/javascript",
    mjs: "text/javascript",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    ico: "image/x-icon",
    txt: "text/plain",
    pdf: "application/pdf",
  };

  return types[ext ?? ""] ?? "application/octet-stream";
}

async function getFileFromPath(path) {
  const root = await navigator.storage.getDirectory();

  const parts = path.split("/").filter(Boolean);

  const fileName = parts.pop();

  if (!fileName) {
    throw new Error("Invalid path");
  }

  let currentDir = root;

  for (const dirName of parts) {
    currentDir = await currentDir.getDirectoryHandle(dirName);
  }

  const fileHandle = await currentDir.getFileHandle(fileName);

  return await fileHandle.getFile();
}
