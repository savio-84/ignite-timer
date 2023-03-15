import { ActionsTypes } from "./actions";
import { produce } from 'immer';

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionsTypes.ADD_NEW_CYCLE:
      // return {
      //   ...state,
      //   cycles: [...state.cycles, action.payload.newCycle],
      //   activeCycleId: action.payload.newCycle.id,
      // }
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle);
        draft.activeCycleId = action.payload.newCycle.id;
      });
    case ActionsTypes.INTERRUPT_CURRENT_CYCLE:
      // return {
      //   ...state,
      //   cycles: state.cycles.map(cycles => {
      //     if (cycles.id === state.activeCycleId) {
      //       return { ...cycles, interruptedDate: new Date() }
      //     } else
      //       return cycles;
      //   }),
      //   activeCycleId: null
      // }
      const currentCycleIndex = state.cycles.findIndex(cycle => cycle.id === state.activeCycleId);

      if (currentCycleIndex < 0) {
        return state;
      }
      return produce(state, draft => {
        draft.activeCycleId = null;
        draft.cycles[currentCycleIndex].interruptedDate = new Date();
      })
    case ActionsTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
      return {
        ...state,
        cycles: state.cycles.map(cycles => {
          if (cycles.id === state.activeCycleId) {
            return { ...cycles, finishedDate: new Date() }
          } else
            return cycles;
        }),
        activeCycleId: null
      };
    default:
      return state;
  }
}