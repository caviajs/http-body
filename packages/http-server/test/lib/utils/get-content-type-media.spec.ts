import { getContentTypeMime } from '../../../src/public-api';

describe('getContentTypeMime', () => {
  it('should return undefined for invalid content-type header', () => {
    expect(getContentTypeMime(undefined)).toBeUndefined();
    expect(getContentTypeMime('')).toBeUndefined();
  });

  it('should return correct mime type', () => {
    expect(getContentTypeMime('text/html')).toBe('text/html');
    expect(getContentTypeMime('text/html; charset=utf-8')).toBe('text/html');
  });
});
