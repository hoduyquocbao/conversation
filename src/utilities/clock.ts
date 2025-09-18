/**
 * @fileoverview Cung cấp lớp Clock để quản lý thời gian và delta time.
 * @description Hữu ích cho các hệ thống cần cập nhật dựa trên thời gian thực đã trôi qua, như animation và physics.
 */

/**
 * @class Clock
 * @description Một lớp tiện ích để quản lý thời gian trong ứng dụng, đặc biệt là tính toán delta time (khoảng thời gian chênh lệch) giữa các frame hoặc các lần cập nhật.
 */
export class Clock {
  /**
   * @private
   * @property {number} _previous - Thuộc tính private lưu trữ dấu thời gian (timestamp) của lần cập nhật trước, tính bằng mili giây.
   */
  private _previous: number;

  /**
   * @constructor
   */
  constructor() {
    // Khởi tạo thời gian trước đó bằng thời gian hiện tại
    this._previous = performance.now();
  }

  /**
   * @method tick
   * @description Cập nhật đồng hồ và trả về khoảng thời gian (tính bằng giây) trôi qua kể từ lần gọi cuối cùng.
   * @returns {number} - Delta time tính bằng giây.
   */
  public tick(): number {
    const now = performance.now();
    const delta = (now - this._previous) / 1000; // Chuyển đổi từ mili giây sang giây
    this._previous = now;
    return delta;
  }
}
