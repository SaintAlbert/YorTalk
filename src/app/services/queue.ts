import { resolve } from "url";

// Queue class
export class Queue {

  // Array is used to implement a Queue
  items=[]
  constructor() {
    this.items = [];
  }

  // Functions to be implemented
  // enqueue function
  enqueue(element) {
    // adding element to the queue
    this.items.push(element);
  }

  // dequeue function
  dequeue() {
    //return new Promise((resolve,reject) => {
    //  if (this.isEmpty())
    //    reject(0)
    //    //return "Underflow";
    //  var e = this.items.shift();
    //  resolve(1);

    // // return this.items.shift();
    //})
    // removing element from the queue
    // returns underflow when called 
    // on empty queue
    if (this.isEmpty())
      return "Underflow";
    return this.items.shift();
  }

  // front function
  front() {
    // returns the Front element of
    // the queue without removing it.
    if (this.isEmpty())
      return "No elements in Queue";
    return this.items[0];
  }

  // isEmpty function
  isEmpty() {
    // return true if the queue is empty.
    return this.items.length == 0;
  }

  // printQueue function
  printQueue() {
    var str = "";
    for (var i = 0; i < this.items.length; i++)
      str += this.items[i] + " ";
    return str;
  }

}
