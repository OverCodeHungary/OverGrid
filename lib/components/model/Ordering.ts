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
    field?: string,
    direction?: OrderDirection
  ) {
    if(field && direction) {
      this.key = field;
      this.direction = direction;
      this.active = isActive;
    }
    else {
      this.active = false;
    }
  }

  constructor() {
    this.active = false;
    this.key = '';
    this.direction = OrderDirection.asc;
  }
}

export {
  Ordering,
  OrderDirection
}