import "server-only";

interface StoredFile {
  id: string;
  fileName: string;
  contentType: string;
  data: Buffer;
  createdAt: string;
}

declare global {
  var __talentLensFiles: Map<string, StoredFile> | undefined;
}

const filesStore = global.__talentLensFiles ?? new Map<string, StoredFile>();

if (!global.__talentLensFiles) {
  global.__talentLensFiles = filesStore;
}

export function saveFile(fileName: string, contentType: string, data: Buffer): StoredFile {
  const id = crypto.randomUUID();
  const entry: StoredFile = {
    id,
    fileName,
    contentType,
    data,
    createdAt: new Date().toISOString(),
  };

  filesStore.set(id, entry);

  return entry;
}

export function getFile(id: string): StoredFile | null {
  return filesStore.get(id) ?? null;
}
