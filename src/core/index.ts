// src/core/index.ts

// =================================================================================================
// Dinh nghia cac kieu du lieu va giao thuc co ban (Core Types and Protocols)
// =================================================================================================

/**
 * @description Một bí danh kiểu (TypeAlias) cho kiểu dữ liệu số ('number'). Nó đóng vai trò là một định danh duy nhất, nhẹ và không thay đổi (immutable unique identifier) để tham chiếu đến một đối tượng logic trong môi trường làm việc. Bản thân 'Entity' chỉ là một con số, hoàn toàn không chứa dữ liệu hay hành vi.
 */
export type Entity = number;

/**
 * @description Một Giao thức (Protocol), định nghĩa một hợp đồng hình thức (formal contract) mà tất cả các lớp dữ liệu 'trait' (-able) phải tuân thủ. Nó hoạt động như một 'marker interface', cho phép hệ thống kiểu (type system) nhận diện và ràng buộc các loại component hợp lệ một cách generic. Trong TypeScript, chúng ta sử dụng một interface rỗng để đại diện cho mục đích này.
 */
export interface Anyable {}

/**
 * @description Một bí danh kiểu đại diện cho một hàm khởi tạo (constructor) của một lớp. Được sử dụng để tham chiếu đến "kiểu" của một component.
 * @template T - Kiểu của đối tượng được tạo ra bởi hàm khởi tạo.
 */
export type Constructor<T> = new (...args: any[]) => T;

// =================================================================================================
// Lop Context - Trung tam quan ly trang thai cua kien truc ECS
// =================================================================================================

/**
 * @class Context<T>
 * @description Lớp trung tâm của kiến trúc Entity-Component-System (ECS). Nó hoạt động như một cơ sở dữ liệu quan hệ trong bộ nhớ (in-memory relational database) cho toàn bộ trạng thái của ứng dụng, nơi các 'Entity' là các hàng và các 'Component' (thành phần) là các cột dữ liệu.
 * @template T - Một kiểu cơ sở (base type) mà tất cả các component phải kế thừa hoặc triển khai, ở đây là 'Anyable'.
 */
export class Context<T extends Anyable> {
  /**
   * @private
   * @property {Set<Entity>} _entities - Một thuộc tính private, là một cấu trúc dữ liệu tập hợp (Set). Nó lưu trữ tất cả các 'Entity' ID đang tồn tại. Việc sử dụng Set đảm bảo mỗi ID là duy nhất và cung cấp hiệu suất truy vấn sự tồn tại của một entity gần như tức thời (thời gian phức tạp O(1)).
   */
  private _entities: Set<Entity> = new Set();

  /**
   * @private
   * @property {Map<Constructor<T>, Map<Entity, T>>} _components - Một thuộc tính private, là một cấu trúc dữ liệu Map hai cấp. Cấp một, key là hàm khởi tạo của component (ví dụ: lớp 'Positionable'), value là một Map khác. Cấp hai, key là 'Entity' ID, value là một thể hiện (instance) cụ thể của component đó. Cấu trúc này được tối ưu hóa cho việc truy vấn nhanh các component theo cả loại và entity ID.
   */
  private _components: Map<Constructor<T>, Map<Entity, T>> = new Map();

  /**
   * @private
   * @property {number} _counter - Một thuộc tính private, là một bộ đếm số nguyên chỉ tăng (strictly monotonic counter). Nó đảm bảo rằng mỗi 'Entity' được tạo ra sẽ nhận một ID hoàn toàn mới và ID của các entity đã bị hủy sẽ không bao giờ được tái sử dụng, tránh các lỗi tham chiếu tiềm ẩn.
   */
  private _counter: number = 0;

  /**
   * @method entity
   * @description Một phương thức chịu trách nhiệm tạo ra một 'Entity' mới. Nó yêu cầu một ID từ '_counter', đăng ký ID đó vào tập hợp '_entities', và trả về ID cho lời gọi. Đây là phương thức duy nhất được phê duyệt để tạo một đối tượng logic mới trong hệ thống.
   * @returns {Entity} - ID của entity vừa được tạo.
   */
  public entity(): Entity {
    const entityId = this._counter++;
    this._entities.add(entityId);
    return entityId;
  }

  /**
   * @method destroy
   * @description Một phương thức để xóa bỏ hoàn toàn một 'entity' và tất cả các component liên quan của nó khỏi 'Context'. Nó sẽ xóa entity ID khỏi '_entities' và xóa tất cả các mục nhập (entry) có key là entity ID đó trong tất cả các Map component.
   * @param {Entity} entity - ID của entity cần hủy.
   */
  public destroy(entity: Entity): void {
    if (!this._entities.has(entity)) {
      return; // Nếu entity không tồn tại, không làm gì cả.
    }

    // Xóa entity khỏi tất cả các bản đồ component
    for (const components of this._components.values()) {
      components.delete(entity);
    }

    // Xóa entity khỏi tập hợp chính
    this._entities.delete(entity);
  }

  /**
   * @method add
   * @description Một phương thức để gắn một thể hiện của 'component' vào một 'entity' cụ thể. Nếu entity đã sở hữu một component cùng loại, nó sẽ được ghi đè bằng giá trị mới. Đây là cơ chế chính để định hình, cấu thành dữ liệu và hành vi của một entity.
   * @param {Entity} entity - ID của entity cần gắn component.
   * @param {T} component - Thể hiện của component cần gắn.
   */
  public add(entity: Entity, component: T): void {
    if (!this._entities.has(entity)) {
        throw new Error(`Entity ${entity} không tồn tại. Không thể thêm component.`);
    }

    const kind = component.constructor as Constructor<T>;
    if (!this._components.has(kind)) {
      this._components.set(kind, new Map<Entity, T>());
    }
    this._components.get(kind)!.set(entity, component);
  }

  /**
   * @method remove
   * @description Một phương thức để gỡ bỏ một 'component' của một loại ('kind') nhất định khỏi một 'entity'. Hành động này làm thay đổi bản chất của entity một cách linh động, khiến nó mất đi một tập dữ liệu hoặc một khía cạnh hành vi nào đó.
   * @param {Entity} entity - ID của entity cần gỡ bỏ component.
   * @param {Constructor<T>} kind - Hàm khởi tạo (lớp) của component cần gỡ bỏ.
   */
  public remove(entity: Entity, kind: Constructor<T>): void {
    if (!this._entities.has(entity)) {
        return; // Không cần báo lỗi nếu entity không tồn tại, chỉ đơn giản là không làm gì.
    }

    const componentMap = this._components.get(kind);
    if (componentMap) {
      componentMap.delete(entity);
    }
  }

  /**
   * @method get
   * @description Một phương thức để truy xuất một thể hiện của 'component' thuộc loại ('kind') được chỉ định từ một 'entity'. Nó trả về thể hiện đó nếu tồn tại, hoặc trả về giá trị 'undefined' để chỉ ra rằng entity không có component loại này, cho phép xử lý an toàn.
   * @template C - Một kiểu cụ thể kế thừa từ T, đại diện cho loại component cần lấy.
   * @param {Entity} entity - ID của entity cần truy vấn.
   * @param {Constructor<C>} kind - Hàm khởi tạo (lớp) của component cần lấy.
   * @returns {C | undefined} - Thể hiện của component nếu có, ngược lại là undefined.
   */
  public get<C extends T>(entity: Entity, kind: Constructor<C>): C | undefined {
    const componentMap = this._components.get(kind as unknown as Constructor<T>);
    if (!componentMap) {
      return undefined;
    }
    return componentMap.get(entity) as C | undefined;
  }

  /**
   * @method has
   * @description Một phương thức để kiểm tra sự tồn tại của một loại component ('kind') trên một 'entity' mà không cần truy xuất toàn bộ dữ liệu của component đó. Nó trả về 'true' nếu có và 'false' nếu không, được tối ưu hóa cho hiệu suất cao.
   * @template C - Một kiểu cụ thể kế thừa từ T.
   * @param {Entity} entity - ID của entity cần kiểm tra.
   * @param {Constructor<C>} kind - Hàm khởi tạo (lớp) của component cần kiểm tra.
   * @returns {boolean} - True nếu entity có component loại này, ngược lại là false.
   */
  public has<C extends T>(entity: Entity, kind: Constructor<C>): boolean {
    const componentMap = this._components.get(kind as unknown as Constructor<T>);
    if (!componentMap) {
      return false;
    }
    return componentMap.has(entity);
  }

  /**
   * @method view
   * @description Phương thức truy vấn cốt lõi và mạnh mẽ nhất của kiến trúc ECS. Nó nhận vào một hoặc nhiều loại component ('kinds') và trả về một đối tượng có thể lặp (Iterable) chứa các 'Entity' ID mà sở hữu *đồng thời tất cả* các loại component được yêu cầu.
   * @template C - Một kiểu cụ thể kế thừa từ T.
   * @param {...Constructor<C>[]} kinds - Một danh sách các hàm khởi tạo (lớp) của các component cần truy vấn.
   * @returns {Iterable<Entity>} - Một đối tượng có thể lặp chứa các ID của entity thỏa mãn điều kiện.
   */
  public *view<C extends T>(...kinds: Constructor<C>[]): Iterable<Entity> {
    if (kinds.length === 0) {
      // Nếu không có loại component nào được yêu cầu, trả về tất cả các entity đang tồn tại
      yield* this._entities;
      return;
    }

    // Lấy ra danh sách các Map component tương ứng với các 'kind' được yêu cầu
    const componentMaps = kinds.map(kind => this._components.get(kind as unknown as Constructor<T>)).filter(map => map !== undefined) as Map<Entity, T>[];

    // Nếu một trong các loại component không tồn tại trong context, kết quả sẽ là rỗng
    if (componentMaps.length !== kinds.length) {
      return;
    }

    // Tìm Map nhỏ nhất để tối ưu hóa việc lặp
    let smallestMap = componentMaps[0];
    for (let i = 1; i < componentMaps.length; i++) {
        if (componentMaps[i].size < smallestMap.size) {
            smallestMap = componentMaps[i];
        }
    }

    // Lặp qua các entity trong Map nhỏ nhất và kiểm tra sự tồn tại trong các Map khác
    for (const entityId of smallestMap.keys()) {
      let hasAll = true;
      for (const map of componentMaps) {
        if (map === smallestMap) continue;
        if (!map.has(entityId)) {
          hasAll = false;
          break;
        }
      }
      if (hasAll) {
        yield entityId;
      }
    }
  }
}
