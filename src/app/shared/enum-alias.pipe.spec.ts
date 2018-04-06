import { EnumAliasPipe } from './enum-alias.pipe';

describe('SharedPipe', () => {
  it('create an instance', () => {
    const pipe = new EnumAliasPipe();
    expect(pipe).toBeTruthy();
  });
});
