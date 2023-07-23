import { EventEmitter } from "node:events";
import vm from "node:vm";

class ComputeCode extends EventEmitter {
  constructor(func, args) {
    super();
    this.func = func;
    this.args = args;
  }

  async compute() {
    try {
      let result = this._exec();
      result = await result;
      this.emit("end", result);
    } catch (error) {
      this.emit("error", error);
    }
  }

  _exec() {
    const context = {
      args: this.args,
      result: null,
      global
    };

    vm.createContext(context);
    vm.runInContext(
      `result = (${this.func})(...args);`,
      context
    );

    return context.result;
  }
}

export default ComputeCode;
