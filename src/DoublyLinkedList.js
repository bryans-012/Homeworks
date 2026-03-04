class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.previous = null;
  }
}

export class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  push(data) {
    const newNode = new Node(data);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.previous = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
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
      if (this.head) {
        this.head.previous = null;
      } else {
        this.tail = null;
      }
      return;
    }

    let current = this.head;
    let count = 0;

    while (current !== null) {
      if (count === index) {
        if (current.previous) {
          current.previous.next = current.next;
        }
        if (current.next) {
          current.next.previous = current.previous;
        } else {
          this.tail = current.previous;
        }
        return;
      }
      current = current.next;
      count++;
    }
  }

  clear() {
    this.head = null;
    this.tail = null;
  }
}
