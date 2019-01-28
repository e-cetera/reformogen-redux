import { Registry } from './registry';

const sentinel = new Object();

describe('Registry', () => {
  describe('error handling', () => {
    it('should check register() arguments', () => {
      const registry = new Registry();
  
      const emptyAdapter = () => registry.register('qwe', '');
      expect(emptyAdapter).toThrowError();
    });
    it('should throw an error if there are no adapters with the requested pattern', () => {
      const registry = new Registry();
      registry.register('/api/v1/', sentinel);
      expect(() => registry.getByUrlPattern('bla')).toThrowError();
      expect(() => registry.unregister('bla')).toThrowError();
    });
  });
  
  it('should register() a handler', () => {
    const registry = new Registry();
    registry.register('/api/v1/', sentinel);
    expect(registry.getByUrlPattern('/api/v1/').adapter).toBe(sentinel);
  });

  it('should clear() the registry', () => {
    const registry = new Registry();
    registry.register('/api/v1/', sentinel);
    registry.clear();
    expect(registry.count).toEqual(0);
  });

  it('should unregister() by a pattern', () => {
    const registry = new Registry();
    
    registry.register('/api/v1/', sentinel);
    const removed = registry.unregister('/api/v1/');
    expect(registry.count).toEqual(0);
    expect(removed.adapter).toBe(sentinel);
    
    registry.register(/api/, sentinel);
    const removedRegExp = registry.unregister(/api/);

  });

  it('should resolveAdapter()', () => {
    const urls = [
      'https://domain.tld/api/v1/checkout/',
      'https://domain.tld/api/v2/checkout',
      'api/v3/checkout/',
      '/api/v4/checkout/',
    ];

    const registry = new Registry();

    registry.register('api/v1', 1);
    const v1Results = urls.map(url => registry.resolveAdapter(url, false));
    expect(v1Results).toEqual([ 1, undefined, undefined, undefined ]);

    registry.register(/api\/v(3|4)/, 2);
    const v2Results = urls.map(url => registry.resolveAdapter(url, false));
    expect(v2Results).toEqual([ 1, undefined, 2, 2 ]);

    registry.register(/.+/, 3);
    const v3Results = urls.map(url => registry.resolveAdapter(url, false));
    expect(v3Results).toEqual([ 1, 3, 2, 2 ]);
  });
});

