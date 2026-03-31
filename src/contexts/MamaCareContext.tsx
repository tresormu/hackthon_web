import React, { createContext, useReducer, useEffect, useState, type ReactNode } from 'react';
import mothersService from '../services/mothersService';
import appointmentsService from '../services/appointmentsService';


export interface Patient {
  id: string | number;
  name: string;
  age: number;
  phone: string;
  stage: 'Pregnant' | 'Postpartum' | 'Infant Care' | 'Archived';
  week?: number;
  status: 'Stable' | 'Moderate' | 'High Risk';
  lastVisit: string;
  misses: number;
  missType: string;
  lastMissed: string;
  preferred: string;
  lmp?: string;
  edd?: string;
  enrolledAt: string;
  birthDate?: string;
  chwAssigned?: string;
}

export interface ChwTask {
  id: string | number;
  patientId: string | number;
  patientName: string;
  task: string;
  status: 'Pending' | 'Completed';
  due: string;
  reason: string;
  chw: string;
}

type ActionType =
  | { type: 'SET_LOADING' }
  | { type: 'SET_PATIENTS'; payload: Patient[] }
  | { type: 'ADD_PATIENT'; payload: Patient }
  | { type: 'UPDATE_PATIENT'; payload: Patient }
  | { type: 'SET_TASKS'; payload: ChwTask[] }
  | { type: 'ADD_TASK'; payload: ChwTask }
  | { type: 'UPDATE_TASK'; payload: ChwTask };

interface State {
  patients: Patient[];
  chwTasks: ChwTask[];
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  patients: [],
  chwTasks: [],
  loading: false,
  error: null,
};

const LOCALSTORAGE_KEY = 'mamacare_token'; // Now for auth token only

function mamaCareReducer(state: State, action: ActionType): State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_PATIENTS':
      return { ...state, patients: action.payload, loading: false };
    case 'ADD_PATIENT':
      return { ...state, patients: [...state.patients, action.payload] };
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: state.patients.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'SET_TASKS':
      return { ...state, chwTasks: action.payload, loading: false };
    case 'ADD_TASK':
      return { ...state, chwTasks: [...state.chwTasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        chwTasks: state.chwTasks.map(t => t.id === action.payload.id ? action.payload : t)
      };
    default:
      return state;
  }
}

interface ContextType {
  state: State;
  dispatch: React.Dispatch<ActionType>;
  addPatient: (data: Omit<Patient, 'id' | 'misses' | 'enrolledAt' | 'lastMissed'>) => Promise<void>;
  incrementMiss: (id: number | string, missType: string, date: string) => Promise<void>;
  assignChw: (patientId: number | string, patientName: string, chw: string, reason: string) => Promise<void>;
  completeTask: (taskId: number | string) => Promise<void>;
  loadData: () => Promise<void>;
}

const MamaCareContext = createContext<ContextType | undefined>(undefined);

export const MamaCareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(mamaCareReducer, initialState);

  // Only load data when authenticated
  useEffect(() => {
    if (localStorage.getItem('token')) loadData();
  }, []);

  const loadData = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
    const [patientsRes, tasksRes] = await Promise.all([
        mothersService.getAll(),
        appointmentsService.getMissedAlerts()
      ]);
      dispatch({ type: 'SET_PATIENTS', payload: patientsRes });
      dispatch({ type: 'SET_TASKS', payload: tasksRes });
    } catch (error) {
      console.error('Load data error:', error);
    }
  };


  const addPatient = async (data: Omit<Patient, 'id' | 'misses' | 'enrolledAt' | 'lastMissed'>) => {
    try {
      const newPatient = await mothersService.create(data as any);
      dispatch({ type: 'ADD_PATIENT', payload: newPatient });
    } catch (error) {
      console.error('Add patient error:', error);
      throw error; // re-throw so the modal can catch and show the error
    }
  };


  const incrementMiss = async (id: number | string, missType: string, _date: string) => {
    try {
      const updated = await mothersService.update(id.toString(), { missedAppointmentsCount: 1 });
      dispatch({ type: 'UPDATE_PATIENT', payload: updated });
    } catch (error) {
      console.error('Increment miss error:', error);
    }
  };


  const assignChw = async (patientId: number | string, patientName: string, chw: string, reason: string) => {
    try {
      await mothersService.assignChw(patientId.toString(), { chw, reason });
      const patients = await mothersService.getAll();
      dispatch({ type: 'SET_PATIENTS', payload: patients });
    } catch (error) {
      console.error('Assign CHW error:', error);
    }
  };


  const completeTask = async (taskId: number | string) => {
    try {
      await appointmentsService.updateStatus(taskId.toString(), 'completed');
      const tasks = await appointmentsService.getMissedAlerts();
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      console.error('Complete task error:', error);
    }
  };

  const value = {
    state,
    dispatch,
    addPatient,
    incrementMiss,
    assignChw,
    completeTask,
    loadData,
  };

  return (
    <MamaCareContext.Provider value={value}>
      {children}
    </MamaCareContext.Provider>
  );
};

export { MamaCareContext };
export type { ContextType };

