export class StorageUtil {
  //Save
  public static storageSave<T>(key: string, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  //Read
  public static storageRead<T>(key: string): T | null {
    const storedValue = sessionStorage.getItem(key);
    try {
      if (storedValue) {
        return JSON.parse(storedValue);
      }
      return null;
    } catch (err) {
      sessionStorage.removeItem(key);
      return null;
    }
  }

  public static storageDelete(key: string) {
    sessionStorage.removeItem(key);
  }
}
