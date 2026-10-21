/** What the client needs from the device's storage: `AsyncStorage` fits as is, `expo-secure-store` through a three-line adapter. */
export interface DiscoveryStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * Keychains cap a value (about 2 KB on iOS): this stores a long string as numbered pieces and a count. A read that finds
 * a missing piece answers `null`, never a truncated document (the manifest is re-verified anyway).
 */
export function chunkedStorage(storage: DiscoveryStorage, size = 1500): DiscoveryStorage {
  const piece = (key: string, i: number) => `${key}.${i}`;
  const clear = async (key: string) => {
    const count = Number((await storage.getItem(`${key}.n`)) ?? 0);
    for (let i = 0; i < count; i++) await storage.removeItem(piece(key, i));
    await storage.removeItem(`${key}.n`);
  };
  return {
    async getItem(key) {
      const count = Number(await storage.getItem(`${key}.n`));
      if (!Number.isInteger(count) || count <= 0) return null;
      let value = "";
      for (let i = 0; i < count; i++) {
        const part = await storage.getItem(piece(key, i));
        if (part === null) return null;
        value += part;
      }
      return value;
    },
    async setItem(key, value) {
      await clear(key);
      const count = Math.ceil(value.length / size);
      for (let i = 0; i < count; i++) await storage.setItem(piece(key, i), value.slice(i * size, (i + 1) * size));
      await storage.setItem(`${key}.n`, String(count));
    },
    removeItem: clear,
  };
}
