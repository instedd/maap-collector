import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

// $FlowFixMe
type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V;
export type Action = {
  +type: string
};

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
export type State = $ObjMap<Reducers, $ExtractFunctionReturn>;
