class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

export class LinkedList {
  constructor() {
    this.head = null;
  }

  push(data) {
    const newNode = new Node(data);

    if (this.head === null) {
      this.head = newNode;
      return;
    }

    let current = this.head;
    while (current.next !== null) {
      current = current.next;
    }
    current.next = newNode;
  }

  toArray() {
    const result = [];
    let current = this.head;

    while (current !== null) {
      result.push(current.data);
      current = current.next;
    }

    return result;
  }

  getSize() {
    let count = 0;
    let current = this.head;

    while (current !== null) {
      count++;
      current = current.next;
    }

    return count;
  }

  getAt(index) {
    let current = this.head;
    let count = 0;

    while (current !== null) {
      if (count === index) {
        return current.data;
      }
      current = current.next;
      count++;
    }

    return null;
  }

  removeAt(index) {
    if (this.head === null) return;

    if (index === 0) {
      this.head = this.head.next;
      return;
    }

    let current = this.head;
    let previous;
    let count = 0;

    while (current !== null) {
      if (count === index) {
        previous.next = current.next;
        return;
      }
      previous = current;
      current = current.next;
      count++;
    }
  }

  clear() {
    this.head = null;
  }
}
