class PaginationClass {
  active: boolean;
  page: number;
  size: number;

  initByState(isActive: boolean, page: number, size: number) {
    this.active = isActive;
    this.page = page;
    this.size = size;
  }

  constructor(active: boolean) {
    this.active = active;
    this.page = 1;
    this.size = 10;
  }
}

export {
  PaginationClass
}