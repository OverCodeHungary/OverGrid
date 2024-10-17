enum OrderDirection {
  asc,
  desc
}

class Ordering {
  active: boolean;
  key: string;
  direction: OrderDirection;

  initByState(
    isActive: boolean,
    field: string,
    direction: OrderDirection,
    defaultOrderKey: string,
    defaultOrderDirection: OrderDirection
  ) {
    this.active = isActive;
    this.key = field || defaultOrderKey;
    this.direction = direction || defaultOrderDirection;
  }

  constructor(active: boolean) {
    this.active = active;
    this.key = '';
    this.direction = OrderDirection.asc;
  }
}

export {
  Ordering,
  OrderDirection
}