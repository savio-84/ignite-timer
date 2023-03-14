import { HandPalm, Play } from "phosphor-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { date, z } from 'zod';
import { differenceInSeconds } from "date-fns";

import {
	CountdownContainer,
	FormContainer,
	HomeContainer,
	MinutesAmountInput,
	Separator,
	StartCountdownButton,
	StopCountdownButton,
	TaskInput
} from "./styles";
import { useEffect, useState } from "react";

const newCycleFormValidationSchema = z.object({
	task: z.string().min(1, "Informe a tarefa."),
	minutesAmount: z
		.number()
		.min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
		.max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
})

// interface newCycleFormData {
// 	task: string;
// 	minutesAmount: number;
// }

type newCycleFormData = z.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
	id: string;
	task: string;
	minutesAmount: number;
	startDate: Date;
	interruptedDate?: Date;
	finishedDate?: Date;
}

export function Home() {

	const [cycles, setCycles] = useState<Cycle[]>([]);
	const [activeCycleId, setActiveCycleId] = useState<string | null>();
	// represents the amount of seconds passeds since the beginning of countdown start
	const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0);

	const { register, handleSubmit, watch, formState, reset } = useForm<newCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: '',
			minutesAmount: 0,
		}
	});

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
	const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

	useEffect(() => {
		let interval: number;

		if (activeCycle) {
			interval = setInterval(() => {
				const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate);
				if (secondsDifference >= totalSeconds) {
					setCycles(cycles => cycles.map(cycle => {
						if (cycle.id === activeCycleId) {
							return { ...cycle, interruptedDate: new Date() }
						} else {
							return cycle;
						}
					}))
					setAmountSecondsPassed(totalSeconds);
					clearInterval(interval);
					setActiveCycleId(null);
					reset();
				}
				else
					setAmountSecondsPassed(secondsDifference);
			}, 1000);
		}

		// this return must always return a function that clear the variables in code.
		return () => {
			clearInterval(interval);
		}
	}, [activeCycle, totalSeconds, activeCycleId]);

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
		// reset();
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



	const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

	const minutesAmount = Math.floor(currentSeconds / 60);
	const secondsAmount = currentSeconds % 60;

	const minutes = String(minutesAmount).padStart(2, '0');
	const seconds = String(secondsAmount).padStart(2, '0');

	useEffect(() => {
		if (activeCycle)
			document.title = `${minutes}:${seconds}`
	}, [minutes, seconds]);


	const task = watch('task');
	const isSubmitDisabled = !task;
	return (
		<HomeContainer>
			<form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
				<FormContainer>
					<label htmlFor="task">Vou trabalhar em</label>
					<TaskInput
						id="task"
						type="text"
						placeholder="Dê um nome para o seu projeto"
						list="task-suggestions"
						disabled={!!activeCycle}
						{...register('task')}
					/>

					<datalist id="task-suggestions">
						<option value="Projeto 1" />
					</datalist>

					<label htmlFor="minutesAmount">durante</label>
					<MinutesAmountInput
						type="number"
						id="minutesAmount"
						step={5}
						max={60}
						min={1}
						disabled={!!activeCycle}
						{...register('minutesAmount', { valueAsNumber: true })}
					/>
					<span>minutos.</span>
				</FormContainer>


				<CountdownContainer>
					<span>{minutes[0]}</span>
					<span>{minutes[1]}</span>
					<Separator>:</Separator>
					<span>{seconds[0]}</span>
					<span>{seconds[1]}</span>
				</CountdownContainer>

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

				{/* <StartCountdownButton disabled={isSubmitDisabled} type="submit">
					<Play size={24} />
					Começar
				</StartCountdownButton> */}
			</form>
		</HomeContainer>
	);
}