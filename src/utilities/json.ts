/**
 * @fileoverview Định nghĩa bí danh kiểu (TypeAlias) cho cấu trúc dữ liệu JSON đệ quy.
 * @description File này chứa định nghĩa cho kiểu 'Json', cho phép kiểm tra kiểu tĩnh (static type checking) đối với các đối tượng hoặc dữ liệu có cấu trúc JSON.
 */

/**
 * @description Một kiểu nguyên thủy trong JSON, có thể là chuỗi, số, boolean, hoặc null.
 */
type JsonPrimitive = string | number | boolean | null;

/**
 * @description Một giá trị JSON, có thể là một kiểu nguyên thủy, một mảng các giá trị JSON, hoặc một đối tượng có các key là chuỗi và value là các giá trị JSON.
 */
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * @description Một đối tượng JSON, là một từ điển (dictionary) với các key kiểu chuỗi và các value là 'JsonValue'.
 */
interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * @description Một mảng JSON, chứa một danh sách các 'JsonValue'.
 */
interface JsonArray extends Array<JsonValue> {}

/**
 * @description Bí danh kiểu (TypeAlias) chính, định nghĩa một cấu trúc dữ liệu JSON đệ quy hợp lệ.
 * Nó có thể là một đối tượng JSON hoặc một mảng JSON.
 */
export type Json = JsonObject | JsonArray;
