/**
 * @fileoverview Cung cấp lớp Color để biểu diễn và thao tác với màu sắc RGBA.
 * @description Lớp dữ liệu này là bất biến (immutable).
 */

/**
 * @class Color
 * @description Một lớp dữ liệu bất biến để biểu diễn và thao tác với các giá trị màu sắc theo mô hình RGBA.
 */
export class Color {
  /**
   * @property {number} r - Kênh màu đỏ (Red), lưu trữ dưới dạng một số nguyên trong khoảng [0, 255].
   * @readonly
   */
  public readonly r: number;

  /**
   * @property {number} g - Kênh màu xanh lá (Green), lưu trữ dưới dạng một số nguyên trong khoảng [0, 255].
   * @readonly
   */
  public readonly g: number;

  /**
   * @property {number} b - Kênh màu xanh dương (Blue), lưu trữ dưới dạng một số nguyên trong khoảng [0, 255].
   * @readonly
   */
  public readonly b: number;

  /**
   * @property {number} a - Kênh alpha (độ trong suốt), lưu trữ dưới dạng một số thực trong khoảng [0.0, 1.0].
   * @readonly
   */
  public readonly a: number;

  /**
   * @constructor
   * @param {number} [r=0] - Giá trị kênh màu đỏ [0, 255].
   * @param {number} [g=0] - Giá trị kênh màu xanh lá [0, 255].
   * @param {number} [b=0] - Giá trị kênh màu xanh dương [0, 255].
   * @param {number} [a=1.0] - Giá trị kênh alpha [0.0, 1.0].
   */
  constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1.0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}
