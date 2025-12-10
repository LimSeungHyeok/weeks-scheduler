import { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';
import './EventModal.css';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Omit<CalendarEvent, 'id'> | CalendarEvent) => void;
    onDelete?: (id: string) => void;
    initialEvent?: CalendarEvent;
    initialDate?: Date;
}

export function EventModal({ isOpen, onClose, onSave, onDelete, initialEvent, initialDate }: EventModalProps) {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialEvent) {
                setTitle(initialEvent.title);
                setStart(initialEvent.startDate);
                setEnd(initialEvent.endDate);
                setDescription(initialEvent.description || '');
            } else {
                setTitle('');
                const d = initialDate || new Date();

                // Use local time for datetime-local input
                // Simple hack: subtract timezone offset to get local ISO string
                const tzOffset = d.getTimezoneOffset() * 60000; // in ms
                const localDate = new Date(d.getTime() - tzOffset);
                const localIso = localDate.toISOString().slice(0, 16);
                setStart(localIso);

                const oneHourLater = new Date(localDate.getTime() + 60 * 60 * 1000);
                setEnd(oneHourLater.toISOString().slice(0, 16));
                setDescription('');
            }
        }
    }, [isOpen, initialEvent, initialDate]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...(initialEvent && { id: initialEvent.id }),
            title,
            startDate: start,
            endDate: end,
            description,
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    {initialEvent ? 'Edit Event' : 'Add Event'}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            className="form-input"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Start</label>
                        <input
                            type="datetime-local"
                            className="form-input"
                            value={start}
                            onChange={e => setStart(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">End</label>
                        <input
                            type="datetime-local"
                            className="form-input"
                            value={end}
                            onChange={e => setEnd(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-input"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="modal-actions">
                        {initialEvent && onDelete && (
                            <button
                                type="button"
                                className="btn"
                                style={{ color: 'var(--destructive)', borderColor: 'var(--destructive)' }}
                                onClick={() => { onDelete(initialEvent.id); onClose(); }}
                            >
                                Delete
                            </button>
                        )}
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
