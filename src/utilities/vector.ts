/**
 * @fileoverview Cung cấp lớp Vector để biểu diễn và thao tác với vector 2D.
 * @description Lớp dữ liệu này là bất biến (immutable), nghĩa là một khi đã được tạo, các thuộc tính của nó không thể thay đổi trực tiếp.
 */

/**
 * @class Vector
 * @description Một lớp dữ liệu bất biến (immutable data class) biểu diễn một vector 2D, được sử dụng rộng rãi cho các phép toán vị trí, dịch chuyển và hình học.
 */
export class Vector {
  /**
   * @property {number} x - Thành phần hoành độ (abscissa) của vector.
   * @readonly
   */
  public readonly x: number;

  /**
   * @property {number} y - Thành phần tung độ (ordinate) của vector.
   * @readonly
   */
  public readonly y: number;

  /**
   * @constructor
   * @param {number} [x=0] - Giá trị khởi tạo cho thành phần x.
   * @param {number} [y=0] - Giá trị khởi tạo cho thành phần y.
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}
