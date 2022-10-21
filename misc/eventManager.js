class EventManager {

  constructor() {
    this.eventMap = new Map();
  }

  addListener(event, fn) {
    let lst = this.eventMap.get(event);

    if (lst == null) {
      lst = [];
      this.eventMap.set(event, lst);
    }

    lst.push(fn);
  }

  removeListener(event, fn) {
    let lst = this.eventMap.get(event);

    if (lst != null) {
      let index = lst.indexOf(fn);
      if (index > -1) lst.splice(index, 1);
    }
  }

  invoke(event, ...args) {
    let lst = this.eventMap.get(event);

    if (lst != null) {
      lst.forEach(e => e(...args));
    }
  }

}