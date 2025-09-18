/**
 * @fileoverview Cung cấp lớp Matrix để thực hiện các phép biến đổi affine 2D.
 * @description Lớp dữ liệu này là bất biến (immutable). Các phương thức biến đổi sẽ trả về một thể hiện Matrix mới.
 */

/**
 * @class Matrix
 * @description Một lớp dữ liệu bất biến biểu diễn một ma trận biến đổi affine 2D, được sử dụng để thực hiện các phép biến đổi hình học như di chuyển (translation), xoay (rotation), và co giãn (scaling) một cách hiệu quả.
 */
export class Matrix {
  /** @readonly */ public readonly a: number;
  /** @readonly */ public readonly b: number;
  /** @readonly */ public readonly c: number;
  /** @readonly */ public readonly d: number;
  /** @readonly */ public readonly e: number;
  /** @readonly */ public readonly f: number;

  /**
   * @constructor
   * @param {number[]} [elements=[1, 0, 0, 1, 0, 0]] - Một mảng 6 phần tử đại diện cho ma trận [a, b, c, d, e, f]. Mặc định là ma trận đơn vị (identity matrix).
   */
  constructor(elements: number[] = [1, 0, 0, 1, 0, 0]) {
    [this.a, this.b, this.c, this.d, this.e, this.f] = elements;
  }
}
