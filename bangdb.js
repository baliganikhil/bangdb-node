var hello = require('./cc/build/Release/addon');

var bangdb = {},
    model_map = {};

function noe(i) { return [undefined, null, ''].indexOf(i) > -1; }

function get_or_else(obj, key, def) {
    if (!obj.hasOwnProperty(key) || noe(obj[key])) { return def; }
    return obj[key];
}

function Schema(schema) {
    for (var schema_key in schema) {
        var schema_value = schema[schema_key];

        if (typeof schema_value === 'function') {

        } else if (typeof schema_value === 'object') {
            var type = schema_value.type;
            if (noe(type)) { throw 'Type has not been passed for ' + schema_key; }
        }
    }

    return schema;
}

function model(model_name, schema) {
    if (noe(model_name)) { throw 'Model name should be passed'; }
    if (model_map.hasOwnProperty(model_name)) { throw 'Model ' + model_name + ' has already been defined'; }

    model_map[model_name] = schema;

    return function (user_model_obj) {
        this.valid = true;
        this.invalid_field = '';
        this.invalid_reason = '';

        this.validate = function () {
            var response = { valid: this.valid };
            if (!this.valid) {
                response.invalid_field = this.invalid_field;
                if (!this.valid) { response.invalid_reason = this.invalid_reason; }
            }

            return response;
        };

        this.save = function (cb) {
            if (typeof cb !== 'function') { throw 'Callback function is required for save'; }

            if (!this.valid) {
                cb(this.validate());
                return;
            }

            cb(null, hello.hello("Hello "));
        };


        var valid = true;

        for (var schema_key in schema) {
            var schema_value = schema[schema_key],
                user_value = user_model_obj[schema_key];

            function validate_type(type) {
                switch(type) {
                    case Number:
                        if (isNaN(Number(user_value))) { valid = false; }
                        break;

                    case Boolean:
                        if (typeof user_value !== 'boolean') { valid = false; }
                        break;

                    case Date:
                        if (!(user_value instanceof Date)) { valid = false; }
                        break;

                    case String:
                        if (typeof user_value !== 'string' && !(user_value instanceof String)) { valid = false; }
                        break;
                }

            }

            if (typeof schema_value === 'function') {
                if (noe(user_value)) { continue; }
                validate_type(schema_value);
            } else if (typeof schema_value === 'object') {
                var type = schema_value.type,
                    required = get_or_else(schema_value, 'required', false),
                    default_value = schema_value.default,
                    min = schema_value.min,
                    max = schema_value.max,
                    validator = schema_value.validator;

                if (noe(type)) { throw 'Type has not been passed for ' + schema_key; }
                if (default_value && noe(user_value)) { user_value = default_value; }
                if (required && noe(user_value)) { valid = false; }
                else if (!noe(user_value)) { validate_type(type); }

                if (!noe(min) && user_value < min) { valid = false; this.invalid_reason = 'Value ' + user_value + ' < ' + min; }
                else if (!noe(max) && user_value > max) { valid = false; this.invalid_reason = 'Value ' + user_value + ' > ' + max; }
                else if (typeof validator === 'function') { valid = validator(user_value); }

            }

            if (!valid) {
                this.valid = false;
                this.invalid_field = schema_key;
                break;
            }
        }
    }
}

bangdb.Schema = Schema;
bangdb.model = model;

module.exports = bangdb;
