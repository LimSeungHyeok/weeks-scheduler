import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import './Header.css';

interface HeaderProps {
    currentDate: Date;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
}

export function Header({ currentDate, onPrev, onNext, onToday }: HeaderProps) {
    return (
        <header className="header">
            <div className="header-title">
                {formatDate(currentDate, 'MMMM yyyy')}
            </div>
            <div className="header-controls">
                <button className="btn-icon" onClick={onToday} title="Today">
                    <Calendar size={20} />
                </button>
                <button className="btn-icon" onClick={onPrev} title="Previous Week">
                    <ChevronLeft size={20} />
                </button>
                <button className="btn-icon" onClick={onNext} title="Next Week">
                    <ChevronRight size={20} />
                </button>
            </div>
        </header>
    );
}
