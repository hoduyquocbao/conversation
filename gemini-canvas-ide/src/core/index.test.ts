/**
 * @fileoverview Bài kiểm thử đơn vị (unit test) cho lớp Context trong module core.
 */

import { Context, Anyable, Entity } from './index';

// Định nghĩa một vài component mẫu để kiểm thử
class Positionable implements Anyable {
  constructor(public x: number, public y: number) {}
}

class Drawable implements Anyable {
  constructor(public shape: string) {}
}

describe('Context', () => {
  let context: Context<Anyable>;

  // Khởi tạo một đối tượng Context mới trước mỗi bài test
  beforeEach(() => {
    context = new Context();
  });

  it('phải tạo ra một entity với ID duy nhất', () => {
    const entity1 = context.entity();
    const entity2 = context.entity();
    expect(entity1).toBe(0);
    expect(entity2).toBe(1);
    expect(entity1).not.toEqual(entity2);
  });

  it('phải thêm và lấy một component từ một entity', () => {
    const entity = context.entity();
    const position = new Positionable(10, 20);
    context.add(entity, position);

    const retrieved = context.get(entity, Positionable);
    expect(retrieved).toBeInstanceOf(Positionable);
    expect(retrieved).toEqual(position);
    expect(retrieved?.x).toBe(10);
  });

  it('phải trả về undefined khi lấy một component không tồn tại', () => {
    const entity = context.entity();
    const retrieved = context.get(entity, Positionable);
    expect(retrieved).toBeUndefined();
  });

  it('phải kiểm tra chính xác sự tồn tại của một component', () => {
    const entity = context.entity();
    expect(context.has(entity, Positionable)).toBe(false);
    context.add(entity, new Positionable(0, 0));
    expect(context.has(entity, Positionable)).toBe(true);
  });

  it('phải gỡ bỏ một component khỏi một entity', () => {
    const entity = context.entity();
    context.add(entity, new Positionable(0, 0));
    expect(context.has(entity, Positionable)).toBe(true);

    context.remove(entity, Positionable);
    expect(context.has(entity, Positionable)).toBe(false);
  });

  it('phải hủy một entity và tất cả các component của nó', () => {
    const entity = context.entity();
    context.add(entity, new Positionable(0, 0));
    context.add(entity, new Drawable('rect'));

    context.destroy(entity);

    expect(context.has(entity, Positionable)).toBe(false);
    expect(context.has(entity, Drawable)).toBe(false);
    // Cố gắng get component cũng phải trả về undefined
    expect(context.get(entity, Positionable)).toBeUndefined();

    // Entity không còn tồn tại trong bất kỳ view nào
    const entities = Array.from(context.view(Positionable));
    expect(entities.includes(entity)).toBe(false);
  });

  it('phải trả về các entity sở hữu một component cụ thể bằng view()', () => {
    const entity1 = context.entity();
    context.add(entity1, new Positionable(1, 1));
    const entity2 = context.entity();
    context.add(entity2, new Drawable('circle'));
    const entity3 = context.entity();
    context.add(entity3, new Positionable(2, 2));

    const positionables = Array.from(context.view(Positionable));
    expect(positionables).toHaveLength(2);
    expect(positionables).toContain(entity1);
    expect(positionables).toContain(entity3);
    expect(positionables).not.toContain(entity2);
  });

  it('phải trả về các entity sở hữu TẤT CẢ các component được yêu cầu bằng view()', () => {
    const entity1 = context.entity(); // Có cả hai
    context.add(entity1, new Positionable(1, 1));
    context.add(entity1, new Drawable('rect'));

    const entity2 = context.entity(); // Chỉ có Positionable
    context.add(entity2, new Positionable(2, 2));

    const entity3 = context.entity(); // Chỉ có Drawable
    context.add(entity3, new Drawable('circle'));

    const viewResult = Array.from(context.view(Positionable, Drawable));
    expect(viewResult).toHaveLength(1);
    expect(viewResult[0]).toBe(entity1);
  });

  it('view() phải trả về một mảng rỗng nếu không có entity nào khớp', () => {
    const entity1 = context.entity();
    context.add(entity1, new Drawable('rect'));

    const viewResult = Array.from(context.view(Positionable));
    expect(viewResult).toHaveLength(0);
  });
});
