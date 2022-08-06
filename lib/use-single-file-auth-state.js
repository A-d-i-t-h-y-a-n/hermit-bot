const {
	BufferJSON,
	initAuthCreds,
	WAProto
} = require("@adiwajshing/baileys")
// useless key map only there to maintain backwards compatibility
// do not use in your own systems please
var KEY_MAP = {
    'pre-key': 'preKeys',
    'session': 'sessions',
    'sender-key': 'senderKeys',
    'app-state-sync-key': 'appStateSyncKeys',
    'app-state-sync-version': 'appStateVersions',
    'sender-key-memory': 'senderKeyMemory'
};
/**
 * @deprecated use multi file auth state instead please
 * stores the full authentication state in a single JSON file
 *
 * DO NOT USE IN A PROD ENVIRONMENT, only meant to serve as an example
 * */
var useSingleFileAuthState = function (filename, logger) {
    // require fs here so that in case "fs" is not available -- the app does not crash
    var _a = require('fs'), readFileSync = _a.readFileSync, writeFileSync = _a.writeFileSync, existsSync = _a.existsSync;
    var creds;
    var keys = {};
    // save the authentication state to a file
    var saveState = function () {
        logger && logger.trace('saving auth state');
        writeFileSync(filename, 
        // BufferJSON replacer utility saves buffers nicely
        JSON.stringify({ creds: creds, keys: keys }, BufferJSON.replacer, 2));
    };
    if (existsSync(filename)) {
        var result = JSON.parse(readFileSync(filename, { encoding: 'utf-8' }), BufferJSON.reviver);
        creds = result.creds;
        keys = result.keys;
    }
    else {
        creds = (0, initAuthCreds)();
        keys = {};
    }
    return {
        state: {
            creds: creds,
            keys: {
                get: function (type, ids) {
                    var key = KEY_MAP[type];
                    return ids.reduce(function (dict, id) {
                        var _a;
                        var value = (_a = keys[key]) === null || _a === void 0 ? void 0 : _a[id];
                        if (value) {
                            if (type === 'app-state-sync-key') {
                                value = WAProto.proto.Message.AppStateSyncKeyData.fromObject(value);
                            }
                            dict[id] = value;
                        }
                        return dict;
                    }, {});
                },
                set: function (data) {
                    for (const _key in data) {
                    	for (const id in data[_key]) {
                    	const value = data[_key][id];
                        const key = KEY_MAP[_key];
                        keys[key] = keys[key] || {};
                        Object.assign(keys[key], data[_key]);
                        value ? logger.trace('auth saved') : delete keys[key][id];
                    }
                    }
                    saveState();
                }
            }
        },
        saveState: saveState
    };
};
exports.useSingleFileAuthState = useSingleFileAuthState;
