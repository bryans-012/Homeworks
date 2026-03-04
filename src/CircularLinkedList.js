class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}
export class CircularLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  push(data) {
    const newNode = new Node(data);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;
    } else {
      newNode.next = this.head;
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }
  toArray() {
    const result = [];
    if (this.head === null) return result;
    let current = this.head;
    let count = 0;
    while (count < this.getSize()) {
      result.push(current.data);
      current = current.next;
      count++;
    }
    return result;
  }
  getSize() {
    if (this.head === null) return 0;
    let count = 1;
    let current = this.head;
    while (current.next !== this.head) {
      count++;
      current = current.next;
    }
    return count;
  }
  getAt(index) {
    if (this.head === null) return null;
    const size = this.getSize();
    const adjustedIndex = index % size;
    let current = this.head;
    for (let i = 0; i < adjustedIndex; i++) {
      current = current.next;
    }
    return current.data;
  }
  removeAt(index) {
    if (this.head === null) return;
    const size = this.getSize();
    const adjustedIndex = index % size;
    if (adjustedIndex === 0) {
      if (size === 1) {
        this.head = null;
        this.tail = null;
      } else {
        this.head = this.head.next;
        this.tail.next = this.head;
      }
      return;
    }
    let current = this.head;
    for (let i = 0; i < adjustedIndex - 1; i++) {
      current = current.next;
    }
    current.next = current.next.next;
    if (adjustedIndex === size - 1) {
      this.tail = current;
    }
  }
  clear() {
    this.head = null;
    this.tail = null;
  }
}
