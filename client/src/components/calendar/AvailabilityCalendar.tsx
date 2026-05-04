'use client';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DayStatus { date: string; status: 'available' | 'booked' | 'blocked'; }

interface AvailabilityCalendarProps {
  hotelId: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function AvailabilityCalendar({ hotelId, selectedDate, onSelectDate }: AvailabilityCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/availability?hotelId=${hotelId}&year=${year}&month=${month + 1}`);
      if (!res.ok) return;
      const data: DayStatus[] = await res.json();
      const map: Record<string, string> = {};
      data.forEach(d => { map[d.date] = d.status; });
      setStatuses(map);
    } catch { /* fallback: all available */ }
    finally { setLoading(false); }
  }, [hotelId, year, month]);

  useEffect(() => { fetchAvailability(); }, [fetchAvailability]);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = today.toISOString().split('T')[0];

  const getStatus = (d: number): 'available' | 'booked' | 'blocked' | 'past' => {
    const pad = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (pad < todayStr) return 'past';
    return (statuses[pad] as 'available' | 'booked' | 'blocked') || 'available';
  };

  const getDateStr = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const C = { amber: '#d97706', bg: '#111110', border: '#292524', dim: '#57534e', green: '#10b981' };

  const cellStyle = (d: number): React.CSSProperties => {
    const status = getStatus(d);
    const dateStr = getDateStr(d);
    const isSelected = dateStr === selectedDate;
    const isPast = status === 'past';
    const isBooked = status === 'booked' || status === 'blocked';
    const isToday = dateStr === todayStr;

    return {
      width: '100%', aspectRatio: '1', border: 'none', borderRadius: 8, cursor: isPast || isBooked ? 'not-allowed' : 'pointer',
      background: isSelected ? C.amber : isBooked ? 'rgba(239,68,68,0.12)' : isToday ? 'rgba(217,119,6,0.15)' : 'transparent',
      color: isSelected ? '#0c0a09' : isPast ? '#3c3836' : isBooked ? '#f87171' : isToday ? C.amber : '#d6d3d1',
      fontWeight: isSelected || isToday ? 700 : 400,
      fontSize: 13,
      position: 'relative',
      fontFamily: 'inherit',
      outline: isToday && !isSelected ? `1px solid rgba(217,119,6,0.4)` : 'none',
      opacity: isPast ? 0.4 : 1,
      transition: 'all 0.15s ease',
    };
  };

  return (
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${C.border}`, background: '#0c0a09' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar style={{ width: 14, height: 14, color: C.amber }} />
          <span style={{ color: C.amber, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em' }}>AVAILABILITY</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <ChevronLeft style={{ width: 16, height: 16 }} />
          </button>
          <span style={{ color: '#e7e5e4', fontSize: 13, fontWeight: 700, minWidth: 130, textAlign: 'center' }}>{MONTHS[month]} {year}</span>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, padding: '10px 12px 4px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', color: C.dim, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', padding: '4px 0' }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, padding: '0 12px 12px', position: 'relative' }}>
        {loading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,10,9,0.5)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <div style={{ width: 16, height: 16, border: `2px solid ${C.amber}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>}

        {/* Blank leading cells */}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const dateStr = getDateStr(d);
          const status = getStatus(d);
          const isBookable = status !== 'past' && status !== 'booked' && status !== 'blocked';
          return (
            <button key={d} style={cellStyle(d)} onClick={() => isBookable && onSelectDate(dateStr)}
              title={status === 'booked' ? 'Already booked' : status === 'blocked' ? 'Not available' : status === 'past' ? 'Past date' : 'Available'}>
              {d}
              {status === 'booked' || status === 'blocked' ? (
                <div style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#f87171' }} />
              ) : status !== 'past' ? (
                <div style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: dateStr === selectedDate ? '#0c0a09' : C.green }} />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, padding: '10px 16px', borderTop: `1px solid ${C.border}`, background: '#0c0a09' }}>
        {[
          { dot: C.green, label: 'Available' },
          { dot: '#f87171', label: 'Booked' },
          { dot: C.amber, label: 'Selected' },
        ].map(({ dot, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot }} />
            <span style={{ color: C.dim, fontSize: 11 }}>{label}</span>
          </div>
        ))}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
