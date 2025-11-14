import React, { useRef, useEffect } from 'react';
import type { E2BEvent } from '../../hooks/useWebSocket';

interface EventLoggerProps {
  events: E2BEvent[];
}

export const EventLogger: React.FC<EventLoggerProps> = ({ events }) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events.length]);

  if (events.length === 0) {
    return <p className="text-muted-foreground italic">Waiting for events...</p>;
  }

  return (
    <>
      {events.map((event, index) => (
        <div key={`${event.timestamp}-${index}`} className="whitespace-pre-wrap mb-1">
          <span
            className={`${
              event.type.includes('error')
                ? 'text-red-500'
                : event.type.includes('completed')
                ? 'text-green-500'
                : event.type.includes('executing')
                ? 'text-blue-500'
                : event.type.includes('command')
                ? 'text-purple-500'
                : 'text-gray-500'
            }`}
          >
            [{new Date(event.timestamp).toLocaleTimeString()}]
          </span>{' '}
          <span className="text-foreground">{event.message}</span>
          {event.details && 'command' in event.details && typeof event.details.command === 'string' && (
            <div className="ml-4 text-purple-400">$ {String(event.details.command)}</div>
          )}
          {event.details && 'stdout' in event.details && typeof event.details.stdout === 'string' && (
            <div className="ml-4 text-green-400 whitespace-pre-wrap">
              {String(event.details.stdout)}
            </div>
          )}
          {event.details && 'stderr' in event.details && typeof event.details.stderr === 'string' && (
            <div className="ml-4 text-red-400">{String(event.details.stderr)}</div>
          )}
        </div>
      ))}
      <div ref={logsEndRef} />
    </>
  );
};
