import { isSameDay, isToday } from 'date-fns';
import { getWeekDays, formatDate } from '../utils/dateUtils';
import { CalendarEvent } from '../types';
import './WeekView.css';

interface WeekViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
    onDayClick: (date: Date) => void;
    onEventDrop?: (eventId: string, targetDate: Date) => void;
}

export function WeekView({ currentDate, events, onEventClick, onDayClick, onEventDrop }: WeekViewProps) {
    const days = getWeekDays(currentDate);

    const handleDragStart = (e: React.DragEvent, eventId: string) => {
        e.dataTransfer.setData('eventId', eventId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetDate: Date) => {
        e.preventDefault();
        const eventId = e.dataTransfer.getData('eventId');
        if (eventId && onEventDrop) {
            onEventDrop(eventId, targetDate);
        }
    };

    return (
        <div className="week-view">
            {days.map((day) => {
                const isCurrentDay = isToday(day);
                const dayEvents = events.filter(e => isSameDay(new Date(e.startDate), day))
                    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

                return (
                    <div
                        key={day.toISOString()}
                        className={`day-column`}
                        onClick={() => onDayClick(day)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, day)}
                    >
                        <div className={`day-header ${isCurrentDay ? 'today' : ''}`}>
                            <div>{formatDate(day, 'EEE')}</div>
                            <div>{formatDate(day, 'd')}</div>
                        </div>
                        <div className="day-content">
                            {dayEvents.map(event => (
                                <div
                                    key={event.id}
                                    className="event-item"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, event.id)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEventClick(event);
                                    }}
                                    title={event.title}
                                >
                                    <div className="event-time">
                                        {formatDate(new Date(event.startDate), 'HH:mm')}
                                    </div>
                                    <div className="event-title">{event.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
