import { parentPort } from "worker_threads";
import ComputeCode from "./compute-code.js";

parentPort.on('message', msg => {
    const {func, args} = (msg ?? {});
    const computeCode = new ComputeCode(func, args);

    computeCode.compute();

    computeCode.once('end', (result) => {
        parentPort.postMessage({evt: 'end', data: result})
    })

    computeCode.once('error', (err) => {
        parentPort.postMessage({evt: 'error', data: err});
    })
})