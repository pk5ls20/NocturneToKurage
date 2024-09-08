import { configBase } from '@/kaze/config/config';

export class kazeContainer<K, V extends configBase> {
  private items: Map<K, V>;

  constructor(items: Map<K, V>) {
    this.items = items;
  }

  public set(key: K, value: V): void {
    this.items.set(key, value);
  }

  keys(): K[] {
    return Array.from(this.items.keys());
  }

  values(): V[] {
    return Array.from(this.items.values());
  }
}
