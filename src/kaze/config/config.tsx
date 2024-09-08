import { DefineComponent, defineComponent, ref, Ref } from 'vue';
import { VCheckbox, VChip, VCol, VFileInput, VRow, VTextField } from 'vuetify/components';

const InitialFS = 18;

abstract class BC<LT extends unknown, VT extends unknown, CT extends boolean> {
  label: LT; // component label
  value: Ref<VT> | Ref<VT>[]; // v-model binding
  title?: string; // title
  controlObject?: CT extends true ? configBase | configBase[] | undefined : never; // component's child
  disabled: boolean = false; // disabled

  protected constructor(
    label: LT,
    value: Ref<VT> | Ref<VT>[],
    title?: string,
    controlObject?: CT extends true ? configBase | configBase[] | undefined : never,
    disabled?: boolean
  ) {
    this.label = label;
    this.value = value;
    this.title = title;
    this.controlObject = controlObject ?? undefined;
    this.disabled = disabled ?? false;
  }

  abstract render(depth: number, isRender: Ref<boolean>): DefineComponent;
}

export class MultiSelectConfig extends BC<string[], boolean, true> {
  constructor(
    label: string[],
    value: Ref<boolean>[],
    title?: string,
    controlObject?: configBase | configBase[],
    disable?: boolean
  ) {
    super(label, value, title, controlObject, disable);
  }

  render(depth: number, isRender: Ref<boolean>): DefineComponent {
    const fontSize = ref(Math.max(InitialFS - depth * 2, 10));
    const title = this.title;
    const label = this.label;
    const value = this.value as Ref<boolean>[];
    const disable = this.disabled;
    const controlObject = this.controlObject as configBase[];

    const updateIsRendered = (index: number, newValue: boolean) => {
      if (controlObject[index]) {
        controlObject[index].isRendered.value = newValue;
      }
    };

    return defineComponent({
      setup() {
        return () => (
          <div>
            {isRender.value ? (
              <div>
                <p style={{ fontSize: `${fontSize.value}px` }}>{title}</p>
                <VRow>
                  {label.map((item, index) => (
                    <VCol key={index} cols="4" sm="4" md="4">
                      <VCheckbox
                        label={item}
                        v-model={value[index].value}
                        disabled={disable}
                        onUpdate:modelValue={(newValue: boolean | null) => updateIsRendered(index, newValue ?? false)}
                      />
                    </VCol>
                  ))}
                </VRow>
              </div>
            ) : null}
          </div>
        );
      },
    });
  }
}

export class TextInputConfig extends BC<string, string, false> {
  constructor(label: string, value: Ref<string>, title?: string, disabled?: boolean) {
    super(label, value, title, undefined, disabled);
  }

  render(depth: number, isRender: Ref<boolean>): DefineComponent {
    const fontSize = ref(Math.max(InitialFS - depth * 2, 10));
    const label = this.label;
    const value = this.value as Ref<string>;
    const title = this.title;
    const disable = this.disabled;

    return defineComponent({
      setup() {
        return () => (
          <div>
            {isRender.value ? (
              <div>
                <p style={{ fontSize: `${fontSize.value}px` }}> {title}</p>
                <VTextField label={label} clearable disabled={disable} v-model={value.value} />
              </div>
            ) : null}
          </div>
        );
      },
    });
  }
}

export class FileInputConfig extends BC<string, File[], false> {
  constructor(label: string, value: Ref<File[]>, title?: string, disabled?: boolean) {
    super(label, value, title, undefined, disabled);
  }

  render(depth: number, isRender: Ref<boolean>): DefineComponent {
    const fontSize = ref(Math.max(InitialFS - depth * 2, 10));
    const label = this.label;
    const files = this.value as Ref<File[]>;
    const title = this.title;
    const disable = this.disabled;

    return defineComponent({
      setup() {
        return () => (
          <div>
            {isRender.value ? (
              <div>
                <p style={{ fontSize: `${fontSize.value}px` }}> {title} </p>
                <VFileInput
                  v-model={files.value}
                  label={label}
                  prepend-icon="mdi-paperclip"
                  clearable={false}
                  multiple
                  disabled={disable}
                >
                  {{
                    selection: ({ fileNames }: { fileNames: string[] }) =>
                      fileNames.map((fileName) => (
                        <VChip key={fileName} class="me-2" size="small" label>
                          {fileName}
                        </VChip>
                      )),
                  }}
                </VFileInput>
              </div>
            ) : null}
          </div>
        );
      },
    });
  }
}

export abstract class configBase {
  configs: BC<unknown, unknown, boolean>[];
  isRendered: Ref<boolean> = ref(true); // TODO: bug?

  protected constructor() {
    this.configs = [];
  }

  render(depth: number = 0, isRender: Ref<boolean> = ref(true)): DefineComponent[] {
    const res: DefineComponent[] = [];
    for (const config of this.configs) {
      const component = config.render(depth, isRender);
      res.push(component);
      if (config.controlObject && Array.isArray(config.controlObject)) {
        for (const c of config.controlObject) {
          res.push(...(c as configBase).render(depth++, c.isRendered));
        }
      }
    }
    return res;
  }
}
