import {dirname, join} from 'node:path';
import { fileURLToPath } from 'node:url';
import WorkerPool from './worker-pool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const workers = new WorkerPool(join(__dirname, 'worker.js'), 3);

class ComputeCode {
    constructor(func, args) {
        this.func = func;
        this.args = args;
    }


    compute() {
        return new Promise(async (res, rej) => {
            const worker = await workers.acquire();

            worker.postMessage({func: this.func, args: this.args});

            const onMessage = (msg) => {
                workers.release(worker);
                if(msg.evt === 'end') {
                    return res(msg.data);
                }
                return rej(msg.data);
            }

            worker.once('message', onMessage)
        })  
    }
}


export default ComputeCode;