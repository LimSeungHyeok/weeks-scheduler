import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { WeekView } from './components/WeekView';
import { EventModal } from './components/EventModal';
import { getNextWeek, getPrevWeek } from './utils/dateUtils';
import { CalendarEvent } from './types';
import './index.css';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('events');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  const [modalDate, setModalDate] = useState<Date>(new Date());

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handlePrev = () => setCurrentDate((d) => getPrevWeek(d));
  const handleNext = () => setCurrentDate((d) => getNextWeek(d));
  const handleToday = () => setCurrentDate(new Date());

  const handleDayClick = (date: Date) => {
    setSelectedEvent(undefined);
    setModalDate(date);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalDate(new Date(event.startDate));
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: CalendarEvent | Omit<CalendarEvent, 'id'>) => {
    if ('id' in eventData) {
      // Update
      setEvents(events.map(e => e.id === eventData.id ? eventData as CalendarEvent : e));
    } else {
      // Create
      const newEvent = { ...eventData, id: uuidv4() };
      setEvents([...events, newEvent]);
    }
    setIsModalOpen(false);
  };

  const moveEvent = (eventId: string, targetDate: Date) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        // Calculate time difference between start of old day and start of time
        const oldStart = new Date(event.startDate);
        const oldEnd = new Date(event.endDate);
        const duration = oldEnd.getTime() - oldStart.getTime();

        // New start date should have the same time as old start date
        const newStart = new Date(targetDate);
        newStart.setHours(oldStart.getHours(), oldStart.getMinutes(), 0, 0);

        const newEnd = new Date(newStart.getTime() + duration);

        return {
          ...event,
          startDate: newStart.toISOString(),
          endDate: newEnd.toISOString()
        };
      }
      return event;
    }));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <Header
        currentDate={currentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />
      <WeekView
        currentDate={currentDate}
        events={events}
        onEventClick={handleEventClick}
        onDayClick={handleDayClick}
        onEventDrop={moveEvent}
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialEvent={selectedEvent}
        initialDate={modalDate}
      />
    </Layout>
  );
}

export default App;
