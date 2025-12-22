import { makeObservable, observable, action, computed } from "mobx";
import { makePersistable } from "mobx-persist-store";

export default abstract class BaseStore {
  data_updated_at = "";

  // 记录默认值
  protected _defaults = {} as { [K in keyof this]: this[K] };

  _init() {
    /**
     * 记录属性默认值
     */
    this._defaults = Object.fromEntries(
      Object.keys(this)
        .filter((i) => i !== "_defaults")
        .map((key) => [key, this[key as keyof this]])
    ) as {
      [K in keyof this]: this[K];
    };

    /**
     * 声明属性和方法
     */
    const instanceKeys = Object.getOwnPropertyNames(this);
    const prototypeKeys = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this)
    );

    const keys = [...new Set([...instanceKeys, ...prototypeKeys])];

    // 构造装饰器映射对象
    const annotations: Record<
      string,
      typeof observable | typeof action | typeof computed
    > = {
      update: action,
      restore: action,
    };

    for (const key of keys) {
      if (["constructor", "_defaults"].includes(key)) continue;

      const value = (this as Record<string, unknown>)[String(key)];

      const descriptor =
        Object.getOwnPropertyDescriptor(this, String(key)) ||
        Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(this),
          String(key)
        );
      if (descriptor && typeof descriptor.get === "function") {
        annotations[key] = computed;
      } else if (descriptor && typeof descriptor.set === "function") {
        annotations[key] = action;
      } else if (typeof value === "function") {
        annotations[key] = action;
      } else {
        annotations[key] = observable;
      }
    }

    makeObservable(this, annotations);

    /**
     * 持久存储属性
     */
    makePersistable(this, {
      name: this.constructor.name,
      properties: Object.keys(this) as (keyof this)[],
      storage: window.localStorage,
    });
  }

  /**
   * 恢复 State 为默认值
   */
  restore() {
    if (!this) return;

    for (const key of Object.keys(this) as (keyof this)[]) {
      if (key === "_defaults") continue;

      this[key] = this._defaults[key];
    }

    this.data_updated_at = new Date().toISOString();
  }

  /**
   * 更新 State
   */
  update<K extends keyof this>(props: Partial<Record<K, this[K]>>) {
    for (const [k, v] of Object.entries(props) as [K, this[K]][]) {
      this[k] = v;
    }

    this.data_updated_at = new Date().toISOString();
  }
}
