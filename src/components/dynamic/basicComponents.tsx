import { DefineComponent, defineComponent, ref, Ref } from 'vue';
import { VCheckbox, VChip, VCol, VFileInput, VRow, VTextField } from 'vuetify/components';
import { dyComponent, dyComponentsTreeBase, rendererHelper } from '@/components/dynamic/dyComponent';

const InitialFS = 18;

export interface MultiSelectExtOpt {
  disable?: boolean;
}

export class MultiSelectComponent extends dyComponent<string[], boolean, true, MultiSelectExtOpt> {
  constructor(
    label: string[],
    value: Ref<boolean>[],
    renderExtInfo: rendererHelper,
    title?: string,
    controlComponent?: dyComponentsTreeBase | dyComponentsTreeBase[],
    extraOptions?: MultiSelectExtOpt
  ) {
    super(label, value, renderExtInfo, title, controlComponent, extraOptions);
  }

  render(depth: number, isRender: Ref<boolean>): DefineComponent {
    const fontSize = ref(Math.max(InitialFS - depth * 2, 10));
    const title = this.title;
    const label = this.label;
    const value = this.value as Ref<boolean>[];
    const controlComponent = this.controlComponent as dyComponentsTreeBase[];
    const disable = this.extraOptions?.disable;

    const updateIsRendered = (index: number, newValue: boolean) => {
      if (controlComponent[index]) {
        const isRender = (controlComponent[index] as any)[this.renderExtInfo.isRenderedName] as Ref<boolean>;
        isRender.value = newValue;
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

export interface TextInputExtOpt {
  disable?: boolean;
}

export class TextInputComponent extends dyComponent<string, string, false, TextInputExtOpt> {
  constructor(
    label: string,
    value: Ref<string>,
    renderExtInfo: rendererHelper,
    title?: string,
    extraOptions?: TextInputExtOpt
  ) {
    super(label, value, renderExtInfo, title, undefined, extraOptions);
  }

  render(depth: number, isRender: Ref<boolean>): DefineComponent {
    const fontSize = ref(Math.max(InitialFS - depth * 2, 10));
    const label = this.label;
    const value = this.value as Ref<string>;
    const title = this.title;
    const disable = this.extraOptions?.disable;

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

export interface FileInputExtOpt {
  disable?: boolean;
  accept?: string;
}

export class FileInputComponent extends dyComponent<string, File[], false, FileInputExtOpt> {
  constructor(
    label: string,
    value: Ref<File[]>,
    renderExtInfo: rendererHelper,
    title?: string,
    extraOptions?: FileInputExtOpt
  ) {
    super(label, value, renderExtInfo, title, undefined, extraOptions);
  }

  render(depth: number, isRender: Ref<boolean>): DefineComponent {
    const fontSize = ref(Math.max(InitialFS - depth * 2, 10));
    const label = this.label;
    const files = this.value as Ref<File[]>;
    const title = this.title;
    const disable = this.extraOptions?.disable;
    const accept = this.extraOptions?.accept;

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
                  {...{ accept: accept }}
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
