(function() {
    var _cache = {};

    function I18N(base) {
        if(base) {
            var ps = ['_locale', '_project', '_keyset', '_key'], p;
            while(p = ps.shift()) this[p] = base[p];
        }
    }

    var I18NPrototype = I18N.prototype;

    I18NPrototype._ = function() {
        var val = _cache[this._locale][this._project][this._keyset][this._key];
        return typeof val == 'string' ? val : val(this._params)
    };

    I18NPrototype.__ = function(project, keyset, key, params) {
        var al = arguments.length;
        if(al) {
            var lastArg = arguments[al - 1],
                hasParams = typeof lastArg != 'string';
            if(hasParams) {
                this.params(lastArg);
                al--;
            }
            al == 1 && this.key(project);
            al == 2 && this.keyset(project).key(keyset);
            al == 3 && this.project(project).keyset(keyset).key(key);
        }

    };

    var ps = ['locale', 'project', 'keyset', 'key', 'params', 'val'], p, i = 0,
        fnMethods = [];
    while(p = ps[i++]) (function(p, _p) {
            I18NPrototype[p] = function(v) { this[_p] = v; return this };
            fnMethods.push([p, function(v) { this._i18n[p](v); return this }]);
        })(p, '_' + p)

    I18NPrototype.val = function(val) {
        var l = _cache[this._locale] || (_cache[this._locale] = {}),
            p = l[this._project] || (l[this._project] = {}),
            k = p[this._keyset] || (p[this._keyset] = {});
        k[this._key] = val;
    };

    fnMethods.push(['clone', function() { return buildFn(new I18N(this._i18n)) }]);

    function buildFn(_i18n) {
        var fn = function() {
                var thisI18N = fn._i18n;
                if(arguments.length) {
                    thisI18N.__.apply(thisI18N, arguments)
                    return fn;
                } else return thisI18N._()
            },
            m, i = 0;
        while(m = fnMethods[i++]) fn[m[0]] = m[1];
        fn._i18n = _i18n;
        return fn;
    }

    this.i18n = buildFn(new I18N());
})();
