import { intervalToDuration } from 'date-fns';

export const convertToTime = (timestamp: number) => {
    const originalDate = new Date(timestamp);
    const currentDate = new Date();
    const diffInSeconds = (currentDate.getTime() - originalDate.getTime()) / 1000;
    const updatedDate = new Date(originalDate.getTime() - diffInSeconds * 1000);

    const { minutes, seconds } = intervalToDuration({
      start: originalDate,
      end: updatedDate,
    });

    const displayMinutes = String(minutes ?? 0).padStart(2, "0");
    const displaySeconds = String(seconds ?? 0).padStart(2, "0");

    return `${displayMinutes}:${displaySeconds}`
}