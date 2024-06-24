import Emittery from "emittery";

export type TEmitterTypes = "402-error";

const emitter = new Emittery<
  Record<TEmitterTypes, string | undefined | null>
>();

export default emitter;
