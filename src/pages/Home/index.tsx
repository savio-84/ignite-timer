import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'

import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from "./styles";

import { createContext, useContext, useEffect, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

const newCycleFormValidationSchema = z.object({
	task: z.string().min(1, "Informe a tarefa."),
	minutesAmount: z
		.number()
		.min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
		.max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
})
type newCycleFormData = z.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
	id: string;
	task: string;
	minutesAmount: number;
	startDate: Date;
	interruptedDate?: Date;
	finishedDate?: Date;
}

interface CycleContextType {
	activeCycle: Cycle | undefined;
	activeCycleId: string | null;
	amountSecondsPassed: number;
	markCurrentCycleAsFinished: () => void;
	setSecondsPassed: (seconds: number) => void;
}

export const CycleContext = createContext({} as CycleContextType);

export function Home() {

	const [cycles, setCycles] = useState<Cycle[]>([]);
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
	const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0);
	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

	const newCycleForm = useForm<newCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: '',
			minutesAmount: 0,
		}
	});

	const { handleSubmit, watch, reset } = newCycleForm;

	function setSecondsPassed(seconds: number) {
		setAmountSecondsPassed(seconds);
	}

	function handleCreateNewCycle({ minutesAmount, task }: newCycleFormData) {
		const newCycle: Cycle = {
			id: String(new Date().getTime()),
			task,
			minutesAmount,
			startDate: new Date(),
		}
		// use arrow function always the state change depends of his previous state;
		setCycles(state => [...state, newCycle]);
		setActiveCycleId(newCycle.id);
		setAmountSecondsPassed(0);
	}

	function handleInterruptCycle() {
		setCycles(cycles => cycles.map(cycle => {
			if (cycle.id === activeCycleId) {
				return { ...cycle, interruptedDate: new Date() }
			} else {
				return cycle;
			}
		}))
		setActiveCycleId(null);
	}

	function markCurrentCycleAsFinished() {
		setCycles(cycles => cycles.map(cycle => {
			if (cycle.id === activeCycleId) {
				reset();
				setActiveCycleId(null);
				return { ...cycle, interruptedDate: new Date() }
			} else {
				return cycle;
			}
		}));
	}


	const task = watch('task');
	const isSubmitDisabled = !task;
	return (
		<HomeContainer>
			<form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>

				<CycleContext.Provider value={{
					activeCycle,
					activeCycleId,
					amountSecondsPassed,
					markCurrentCycleAsFinished,
					setSecondsPassed
				}}>
					<FormProvider {...newCycleForm} >
						<NewCycleForm />
					</FormProvider>
					<Countdown />
				</CycleContext.Provider>

				{
					activeCycle ? (
						<StopCountdownButton onClick={handleInterruptCycle} type="button">
							<HandPalm size={24} />
							Interromper
						</StopCountdownButton>
					) : (
						<StartCountdownButton disabled={isSubmitDisabled} type="submit">
							<Play size={24} />
							Começar
						</StartCountdownButton>
					)
				}

			</form>
		</HomeContainer>
	);
}