import { FormatCardValuePipe } from './format-card-value.pipe';

describe('FormatCardValuePipe', () => {
  let pipe: FormatCardValuePipe;

  beforeEach(() => {
    pipe = new FormatCardValuePipe();
  });

  it('should return string representation of number', () => {
    const value = 5;
    expect(pipe.transform(value)).toBe('5');
  });

  it('should return empty string for undefined', () => {
    const value = undefined;
    expect(pipe.transform(value)).toBe('');
  });

  it('should return empty string for null', () => {
    const value = null;
    expect(pipe.transform(value)).toBe('');
  });

  it('should ignore extra arguments', () => {
    const value = 5;
    const extraArg = 'extra';
    expect(pipe.transform(value, extraArg)).toBe('5');
  });
});