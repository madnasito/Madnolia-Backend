"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializeInterceptor = void 0;
exports.AuthSerialize = AuthSerialize;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const rxjs_1 = require("rxjs");
function AuthSerialize(dto) {
    return (0, common_1.UseInterceptors)(new SerializeInterceptor(dto));
}
class SerializeInterceptor {
    constructor(dto) {
        this.dto = dto;
    }
    intercept(context, next) {
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            return (0, class_transformer_1.plainToClass)(this.dto, data, {});
        }));
    }
}
exports.SerializeInterceptor = SerializeInterceptor;
//# sourceMappingURL=auth.interceptor.js.map