"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsImageFile = void 0;
const class_validator_1 = require("class-validator");
let IsImageFile = class IsImageFile {
    validate(mimeType, args) {
        console.log("IMG INTERCEPTOR");
        console.log(mimeType);
        const acceptMimeTypes = ['image/png', 'image/jpeg'];
        const fileType = acceptMimeTypes.find((type) => type === mimeType);
        if (!fileType)
            return false;
        return true;
    }
    defaultMessage(validationArguments) {
        return 'The file type was not accepted.';
    }
};
exports.IsImageFile = IsImageFile;
exports.IsImageFile = IsImageFile = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: false, name: 'img' })
], IsImageFile);
//# sourceMappingURL=image.guard.js.map