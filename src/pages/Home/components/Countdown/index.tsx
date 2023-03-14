import { differenceInSeconds } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { CycleContext } from "../..";
import { CountdownContainer, Separator } from "./styles";


export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    amountSecondsPassed,
    markCurrentCycleAsFinished,
    setSecondsPassed
  } = useContext(CycleContext);

  // represents the amount of seconds passeds since the beginning of countdown start
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate);
        if (secondsDifference >= totalSeconds) {
          // setCycles(cycles => cycles.map(cycle => {
          //   if (cycle.id === activeCycleId) {
          //     return { ...cycle, interruptedDate: new Date() }
          //   } else {
          //     return cycle;
          //   }
          // }))
          markCurrentCycleAsFinished();
          setSecondsPassed(totalSeconds);
          clearInterval(interval);
          // setActiveCycleId(null);
          // reset();
        }
        else
          setSecondsPassed(secondsDifference);
      }, 1000);
    }

    // this return must always return a function that clear the variables in code.
    return () => {
      clearInterval(interval);
    }
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished]);

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, '0');
  const seconds = String(secondsAmount).padStart(2, '0');

  useEffect(() => {
    if (activeCycle)
      document.title = `${minutes}:${seconds}`
  }, [minutes, seconds]);

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}