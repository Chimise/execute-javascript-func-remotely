import {Worker} from 'node:worker_threads';

class WorkerPool {
    constructor(file, maxSize) {
        this.file = file;
        this.maxSize = maxSize;
        this.waiting = [];
        this.active = [];
        this.pool = [];
    }

    acquire() {
        return new Promise((resolve, reject) => {
            let worker;
            if(this.pool.length > 0) {
                worker = this.pool.pop();
                this.active.push(worker);
                return resolve(worker);
            }

            if(this.active.length >= this.maxSize) {
                return this.waiting.push({resolve, reject});
            }

            worker = new Worker(this.file);
            worker.once('online', () => {
                this.active.push(worker);
                resolve(worker);
            })

            worker.once('exit', (exitCode) => {
                console('Worker exited with code %d', exitCode);
                this.active = this.active.filter(w => w !== worker);
                this.pool = this.pool.filter(w => w !== worker);
            })

        })
    }


    release(worker) {
        if(this.waiting.length > 0) {
            const {resolve} = this.waiting.unshift();
            return resolve(worker);
        }
        this.active = this.active.filter(w => w !== worker);
        this.pool.push(worker);
    }
}


export default WorkerPool;