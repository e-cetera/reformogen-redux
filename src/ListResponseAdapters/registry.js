export class Registry {
  registeredAdapters = [];
  register(urlPattern, adapter) {
    adapter || throw new Error('`adapter` must be some truthy value');

    this.registeredAdapters.push({
      urlPattern,
      rx: new RegExp(urlPattern),
      adapter,
    });
  }

  get count() {
    return this.registeredAdapters.length;
  }
  clear() {
    this.registeredAdapters = [];
  }

  unregister(urlPattern) {
    const removed = this.getByUrlPattern(urlPattern);
    this.registeredAdapters = this.registeredAdapters.filter(adapter => adapter !== removed);
    return removed;
  }

  getByUrlPattern(lookupUrlPattern) {
    const adapter = this.registeredAdapters.find(
      ({ urlPattern }) => 
        urlPattern.toString() === lookupUrlPattern.toString()
    ) || throw new Error(`No adapter registered for the pattern ${lookupUrlPattern}`);
    return adapter;
  }

  resolveAdapter(url, strict=true) {
    for (const { adapter, rx } of this.registeredAdapters) {
      if (rx.test(url))
        return adapter;
    }

    strict && throw new Error(`No adapters were found for url ${url}`);
  }
}

export const responseAdapterRegistry = new Registry();
