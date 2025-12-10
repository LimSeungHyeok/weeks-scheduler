import { startOfWeek, endOfWeek, eachDayOfInterval, format, addWeeks, subWeeks } from 'date-fns';

export const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday start
    const end = endOfWeek(date, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
};

export const formatDate = (date: Date, formatStr: string) => {
    return format(date, formatStr);
};

export const getNextWeek = (date: Date) => addWeeks(date, 1);
export const getPrevWeek = (date: Date) => subWeeks(date, 1);
