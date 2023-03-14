import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'

import { z } from "zod";

import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from "./styles";

import { createContext, useContext, useEffect, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { CycleContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = z.object({
	task: z.string().min(1, "Informe a tarefa."),
	minutesAmount: z
		.number()
		.min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
		.max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
})
type newCycleFormData = z.infer<typeof newCycleFormValidationSchema>;

export function Home() {

	const {
		activeCycle,
		createNewCycle,
		interruptCurrentCycle,
	} = useContext(CycleContext);

	const newCycleForm = useForm<newCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: '',
			minutesAmount: 0,
		}
	});

	const { handleSubmit, watch, reset } = newCycleForm;

	function handleCreateNewCycle(data: newCycleFormData) {
		createNewCycle(data);
		// reset();
	}

	function handleInterruptCycle() {
		interruptCurrentCycle();
		reset();
	}

	const task = watch('task');
	const isSubmitDisabled = !task;
	return (
		<HomeContainer>
			<form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
				<FormProvider {...newCycleForm} >
					<NewCycleForm />
				</FormProvider>
				<Countdown reset={reset} />

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