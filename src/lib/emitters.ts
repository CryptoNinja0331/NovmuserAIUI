import Emittery from "emittery";

export type TEmitterTypes = "402-error" | "novelItem-interval";

const emitter = new Emittery<
  Record<TEmitterTypes, string | undefined | null>
>();

export default emitter;
