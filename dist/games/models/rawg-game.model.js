"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = exports.Language = void 0;
var Language;
(function (Language) {
    Language["Eng"] = "eng";
})(Language || (exports.Language = Language = {}));
class Convert {
    static toRawgGame(json) {
        return cast(JSON.parse(json), r("RawgGame"));
    }
    static rawgGameToJson(value) {
        return JSON.stringify(uncast(value, r("RawgGame")), null, 2);
    }
}
exports.Convert = Convert;
function invalidValue(typ, val, key, parent = '') {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}
function prettyTypeName(typ) {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        }
        else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    }
    else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    }
    else {
        return typeof typ;
    }
}
function jsonToJSProps(typ) {
    if (typ.jsonToJS === undefined) {
        const map = {};
        typ.props.forEach((p) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}
function jsToJSONProps(typ) {
    if (typ.jsToJSON === undefined) {
        const map = {};
        typ.props.forEach((p) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}
function transform(val, typ, getProps, key = '', parent = '') {
    function transformPrimitive(typ, val) {
        if (typeof typ === typeof val)
            return val;
        return invalidValue(typ, val, key, parent);
    }
    function transformUnion(typs, val) {
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            }
            catch (_) { }
        }
        return invalidValue(typs, val, key, parent);
    }
    function transformEnum(cases, val) {
        if (cases.indexOf(val) !== -1)
            return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }
    function transformArray(typ, val) {
        if (!Array.isArray(val))
            return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }
    function transformDate(val) {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }
    function transformObject(props, additional, val) {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }
    if (typ === "any")
        return val;
    if (typ === null) {
        if (val === null)
            return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false)
        return invalidValue(typ, val, key, parent);
    let ref = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ))
        return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val, key, parent);
    }
    if (typ === Date && typeof val !== "number")
        return transformDate(val);
    return transformPrimitive(typ, val);
}
function cast(val, typ) {
    return transform(val, typ, jsonToJSProps);
}
function uncast(val, typ) {
    return transform(val, typ, jsToJSONProps);
}
function l(typ) {
    return { literal: typ };
}
function a(typ) {
    return { arrayItems: typ };
}
function u(...typs) {
    return { unionMembers: typs };
}
function o(props, additional) {
    return { props, additional };
}
function m(additional) {
    return { props: [], additional };
}
function r(name) {
    return { ref: name };
}
const typeMap = {
    "RawgGame": o([
        { json: "id", js: "id", typ: 0 },
        { json: "slug", js: "slug", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "name_original", js: "name_original", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "metacritic", js: "metacritic", typ: null },
        { json: "metacritic_platforms", js: "metacritic_platforms", typ: a("any") },
        { json: "released", js: "released", typ: Date },
        { json: "tba", js: "tba", typ: true },
        { json: "updated", js: "updated", typ: Date },
        { json: "background_image", js: "background_image", typ: "" },
        { json: "background_image_additional", js: "background_image_additional", typ: "" },
        { json: "website", js: "website", typ: "" },
        { json: "rating", js: "rating", typ: 0 },
        { json: "rating_top", js: "rating_top", typ: 0 },
        { json: "ratings", js: "ratings", typ: a("any") },
        { json: "reactions", js: "reactions", typ: null },
        { json: "added", js: "added", typ: 0 },
        { json: "added_by_status", js: "added_by_status", typ: r("AddedByStatus") },
        { json: "playtime", js: "playtime", typ: 0 },
        { json: "screenshots_count", js: "screenshots_count", typ: 0 },
        { json: "movies_count", js: "movies_count", typ: 0 },
        { json: "creators_count", js: "creators_count", typ: 0 },
        { json: "achievements_count", js: "achievements_count", typ: 0 },
        { json: "parent_achievements_count", js: "parent_achievements_count", typ: 0 },
        { json: "reddit_url", js: "reddit_url", typ: "" },
        { json: "reddit_name", js: "reddit_name", typ: "" },
        { json: "reddit_description", js: "reddit_description", typ: "" },
        { json: "reddit_logo", js: "reddit_logo", typ: "" },
        { json: "reddit_count", js: "reddit_count", typ: 0 },
        { json: "twitch_count", js: "twitch_count", typ: 0 },
        { json: "youtube_count", js: "youtube_count", typ: 0 },
        { json: "reviews_text_count", js: "reviews_text_count", typ: 0 },
        { json: "ratings_count", js: "ratings_count", typ: 0 },
        { json: "suggestions_count", js: "suggestions_count", typ: 0 },
        { json: "alternative_names", js: "alternative_names", typ: a("any") },
        { json: "metacritic_url", js: "metacritic_url", typ: "" },
        { json: "parents_count", js: "parents_count", typ: 0 },
        { json: "additions_count", js: "additions_count", typ: 0 },
        { json: "game_series_count", js: "game_series_count", typ: 0 },
        { json: "user_game", js: "user_game", typ: null },
        { json: "reviews_count", js: "reviews_count", typ: 0 },
        { json: "community_rating", js: "community_rating", typ: 0 },
        { json: "saturated_color", js: "saturated_color", typ: "" },
        { json: "dominant_color", js: "dominant_color", typ: "" },
        { json: "parent_platforms", js: "parent_platforms", typ: a(r("ParentPlatform")) },
        { json: "platforms", js: "platforms", typ: a(r("PlatformElement")) },
        { json: "stores", js: "stores", typ: a(r("Store")) },
        { json: "developers", js: "developers", typ: a(r("Developer")) },
        { json: "genres", js: "genres", typ: a(r("Developer")) },
        { json: "tags", js: "tags", typ: a(r("Developer")) },
        { json: "publishers", js: "publishers", typ: a(r("Developer")) },
        { json: "esrb_rating", js: "esrb_rating", typ: null },
        { json: "clip", js: "clip", typ: null },
        { json: "description_raw", js: "description_raw", typ: "" },
    ], false),
    "AddedByStatus": o([
        { json: "owned", js: "owned", typ: 0 },
    ], false),
    "Developer": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "slug", js: "slug", typ: "" },
        { json: "games_count", js: "games_count", typ: 0 },
        { json: "image_background", js: "image_background", typ: "" },
        { json: "domain", js: "domain", typ: u(undefined, "") },
        { json: "language", js: "language", typ: u(undefined, r("Language")) },
    ], false),
    "ParentPlatform": o([
        { json: "platform", js: "platform", typ: r("ParentPlatformPlatform") },
    ], false),
    "ParentPlatformPlatform": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "slug", js: "slug", typ: "" },
    ], false),
    "PlatformElement": o([
        { json: "platform", js: "platform", typ: r("PlatformPlatform") },
        { json: "released_at", js: "released_at", typ: Date },
        { json: "requirements", js: "requirements", typ: r("Requirements") },
    ], false),
    "PlatformPlatform": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "slug", js: "slug", typ: "" },
        { json: "image", js: "image", typ: null },
        { json: "year_end", js: "year_end", typ: null },
        { json: "year_start", js: "year_start", typ: null },
        { json: "games_count", js: "games_count", typ: 0 },
        { json: "image_background", js: "image_background", typ: "" },
    ], false),
    "Requirements": o([
        { json: "minimum", js: "minimum", typ: "" },
        { json: "recommended", js: "recommended", typ: "" },
    ], false),
    "Store": o([
        { json: "id", js: "id", typ: 0 },
        { json: "url", js: "url", typ: "" },
        { json: "store", js: "store", typ: r("Developer") },
    ], false),
    "Language": [
        "eng",
    ],
};
//# sourceMappingURL=rawg-game.model.js.map