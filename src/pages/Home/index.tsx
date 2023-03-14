import { Play } from "phosphor-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';

import {
	CountdownContainer,
	FormContainer,
	HomeContainer,
	MinutesAmountInput,
	Separator,
	StartCountdownButton,
	TaskInput
} from "./styles";

const newCycleFormValidationSchema = z.object({
	task: z.string().min(1, "Informe a tarefa."),
	minutesAmount: z
		.number()
		.min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
		.max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
})

// interface newCycleFormData {
// 	task: string;
// 	minutesAmount: number;
// }

type newCycleFormData = z.infer<typeof newCycleFormValidationSchema>;

export function Home() {
	const { register, handleSubmit, watch, formState, reset } = useForm<newCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: '',
			minutesAmount: 0,
		}
	});

	function handleCreateNewCycle(data: any) {
		console.log(data);
		reset();
	}


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
						min={5}
						{...register('minutesAmount', { valueAsNumber: true })}
					/>
					<span>minutos.</span>
				</FormContainer>


				<CountdownContainer>
					<span>0</span>
					<span>0</span>
					<Separator>:</Separator>
					<span>0</span>
					<span>0</span>
				</CountdownContainer>

				<StartCountdownButton disabled={isSubmitDisabled} type="submit">
					<Play size={24} />
					Começar
				</StartCountdownButton>
			</form>
		</HomeContainer>
	);
}