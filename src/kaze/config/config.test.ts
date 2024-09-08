import { expect, test } from 'vitest';
import { kazeClient } from '@/kaze/client/kazeClient';

test('config1', () => {
  const cl = new kazeClient();
  const configs = cl.render();
  expect(configs.length).toBe(5);
});
