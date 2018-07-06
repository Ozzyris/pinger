import { SanitizorPipe } from './sanitizor.pipe';

describe('SanitizorPipe', () => {
  it('create an instance', () => {
    const pipe = new SanitizorPipe();
    expect(pipe).toBeTruthy();
  });
});
