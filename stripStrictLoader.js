function stripStrictLoader(content) {
    if (content.includes('use strict')) content.replace(/('|")use strict('|");?/gm, '');
    if (this.cacheable) this.cacheable(true);
    return content;
}