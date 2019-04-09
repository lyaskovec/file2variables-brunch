class File2VarsCompiler {
    constructor(config) {
        this.config = config.plugins.file2variables || {};
        this.pattern = {test: path => {
            let check = false;
            Object.keys(this.config).forEach(key => {
                if (path.match(this.config[key])) {
                    check = true
                }
            })
            return check;
        }}
    }

    compile(file) {
        const data = file.data;
        const path = file.path;
        let k = false;
        let match = null;
        Object.keys(this.config).forEach(key => {
            match = path.match(this.config[key]);
            if (match) {
                k = key;
            }
        })
        let compiled = data;
        if (k) {
            compiled = `(function(){(this['${k}'] = this['${k}'] || {})["${match[1]}"] = \`${data}\`;})();`
        }
        return Promise.resolve({data: compiled});
    }
}

File2VarsCompiler.prototype.brunchPlugin = true;
File2VarsCompiler.prototype.type = 'javascript';
File2VarsCompiler.prototype.pattern = /./;

module.exports = File2VarsCompiler;
