import { DefineComponent, ref, Ref } from 'vue';

export abstract class dyComponent<LT extends unknown, VT extends unknown, CT extends boolean, ET extends unknown> {
  label: LT; // component label
  value: Ref<VT> | Ref<VT>[]; // v-model binding
  renderExtInfo: rendererHelper;
  title?: string; // title
  controlComponent?: CT extends true ? dyComponentsTreeBase | dyComponentsTreeBase[] | undefined : never; // component's child
  extraOptions?: ET; // extra options

  protected constructor(
    label: LT,
    value: Ref<VT> | Ref<VT>[],
    renderExtInfo: rendererHelper,
    title?: string,
    controlComponent?: CT extends true ? dyComponentsTreeBase | dyComponentsTreeBase[] | undefined : never,
    extraOptions?: ET extends never ? never : ET
  ) {
    this.label = label;
    this.value = value;
    this.renderExtInfo = renderExtInfo;
    this.title = title;
    this.controlComponent = controlComponent;
    this.extraOptions = extraOptions;
  }

  abstract render(depth: number, isRender: Ref<boolean>): DefineComponent;
}

export abstract class dyComponentsTreeBase {
  components: dyComponent<unknown, unknown, boolean, unknown>[] = [];
  isRendered: Ref<boolean> = ref(true);

  _render(
    depth: number,
    isRender: Ref<boolean>,
    comps: dyComponent<unknown, unknown, boolean, unknown>[],
    _helper: rendererHelper = {
      propName: 'components',
      isRenderedName: 'isRendered',
      renderMethodName: '_render',
    }
  ): DefineComponent[] {
    const res: DefineComponent[] = [];
    for (const config of comps) {
      const component = config.render(depth, isRender); // common rendererComponents in dyComponent
      res.push(component);
      if (config.controlComponent && Array.isArray(config.controlComponent)) {
        for (const c of config.controlComponent) {
          res.push(
            ...(c as dyComponentsTreeBase)._render(
              depth++,
              (c as any)[_helper.isRenderedName] || isRender, // (c as any)[_helper.isRenderedName] may undefined
              (c as any)[_helper.propName] || c.components, // (c as any)[_helper.propName] may undefined
              _helper
            )
          ); // commonly, helper will not change in a single tree (as designed)
        }
      }
    }
    return res;
  }

  render(
    depth: number = 0,
    isRender: Ref<boolean> = this.isRendered,
    comps: dyComponent<unknown, unknown, boolean, unknown>[] = this.components
  ): DefineComponent[] {
    return this._render(depth, isRender, comps);
  }
}

export type rendererType<Name extends readonly string[]> = {
  [K in Name[number] as `${K}Components`]: dyComponent<unknown, unknown, boolean, unknown>[];
} & {
  [K in Name[number] as `${K}Render`]: (
    depth: number,
    isRender: Ref<boolean>,
    comps: dyComponent<unknown, unknown, boolean, unknown>[]
  ) => DefineComponent[];
} & {
  [K in Name[number] as `is${K}Rendered`]: Ref<boolean>;
} & {
  [K in Name[number] as `_rd_${K}`]: rendererHelper;
};

type Constructor<T = {}> = new (...args: any[]) => T;

export type rendererHelper = {
  propName: string;
  isRenderedName: string;
  renderMethodName: string;
};

export function rendererComponents<Name extends string[]>(name: Name) {
  return function <T extends dyComponentsTreeBase>(target: Constructor<T>): Constructor<T & rendererType<Name>> {
    console.log(`Adding ${name}Render to ${target.name}`);
    name.forEach((singleName) => {
      const propName = `${singleName}Components` as const;
      const isRenderedName = `is${singleName}Rendered` as const;
      const renderMethodName = `${singleName}Render` as const;
      target.prototype[`_rd_${singleName}`] = {
        propName,
        isRenderedName,
        renderMethodName,
      } as rendererHelper;
      target.prototype[propName] = [];
      target.prototype[isRenderedName] = ref(true);
      target.prototype[renderMethodName] = function (
        depth: number = 0,
        isRender: Ref<boolean> = ref(true)
      ): DefineComponent[] {
        return this._render(depth, isRender, this[propName], this[`_rd_${singleName}`]);
      };
    });
    return target as Constructor<T & rendererType<Name>>;
  };
}
