import React from 'react';
import type { E2BEvent } from '../../hooks/useWebSocket';
import { useE2BEventIcon } from '../../hooks/useE2BEventIcon';
import { useE2BEventColor } from '../../hooks/useE2BEventColor';

interface E2BEventItemProps {
  event: E2BEvent;
}

export const E2BEventItem: React.FC<E2BEventItemProps> = ({ event }) => {
  const icon = useE2BEventIcon(event);
  const colorClass = useE2BEventColor(event);

  return (
    <div className={`flex items-start space-x-2 px-3 py-2 rounded-lg text-xs border ${colorClass}`}>
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{event.message}</div>
        {event.details && 'location' in event.details && typeof event.details.location === 'string' && (
          <div className="text-[10px] opacity-70 mt-0.5 truncate">
            {String(event.details.location)}
          </div>
        )}
        {event.details && 'command' in event.details && typeof event.details.command === 'string' && (
          <div className="text-[10px] opacity-70 mt-0.5 truncate font-mono">
            $ {String(event.details.command)}
          </div>
        )}
      </div>
    </div>
  );
};
