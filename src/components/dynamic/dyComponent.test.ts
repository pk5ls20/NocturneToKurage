import { expect, test } from 'vitest';
import { kazeClient } from '@/kaze/client/kazeClient';
import {
  dyComponent,
  dyComponentsTreeBase,
  rendererComponents,
  rendererHelper,
  rendererType,
} from '@/components/dynamic/dyComponent';
import { DefineComponent, ref, Ref } from 'vue';
import { TextInputComponent } from '@/components/dynamic/basicComponents';

test('single-config', () => {
  const kc = new kazeClient();
  const configs = kc.configRender();
  expect(configs.length).toBe(5);
});

test('multi-config', () => {
  @rendererComponents(['config1', 'config2'])
  class testConfig2 extends dyComponentsTreeBase implements rendererType<['config1', 'config2']> {
    config1Components!: dyComponent<unknown, unknown, boolean, unknown>[];
    isconfig1Rendered!: Ref<boolean>;
    _rd_config1!: rendererHelper;
    config1Render!: (depth?: number, isRender?: Ref<boolean>) => DefineComponent[];
    config2Components!: dyComponent<unknown, unknown, boolean, unknown>[];
    isconfig2Rendered!: Ref<boolean>;
    config2Render!: (depth?: number, isRender?: Ref<boolean>) => DefineComponent[];
    _rd_config2!: rendererHelper;

    constructor() {
      super();
      this.isconfig1Rendered = this.isconfig1Rendered || this.constructor.prototype.isconfig1Rendered;
      this._rd_config1 = this._rd_config1 || this.constructor.prototype._rd_config1;
      this.config1Render = this.config1Render || this.constructor.prototype.config1Render;
      this.config1Components = [
        new TextInputComponent('', ref(''), this._rd_config1, '1.1'),
        new TextInputComponent('', ref(''), this._rd_config1, '1.2'),
      ];
      this.isconfig2Rendered = this.isconfig2Rendered || this.constructor.prototype.isconfig2Rendered;
      this._rd_config2 = this._rd_config2 || this.constructor.prototype._rd_config2;
      this.config2Render = this.config2Render || this.constructor.prototype.config2Render;
      this.config2Components = [new TextInputComponent('', ref(''), this._rd_config2, '2.1')];
    }
  }

  const tc2 = new testConfig2();
  const r1 = tc2.config1Render();
  const r2 = tc2.config2Render();
  expect(r1.length).toBe(2);
  expect(r2.length).toBe(1);
});
