import React from 'react';
import { Loader, CheckCircle, XCircle, Play, Hammer } from 'lucide-react';
import type { E2BEvent } from './useWebSocket';

export const useE2BEventIcon = (event: E2BEvent): React.ReactNode => {
  if (event.type.includes('error')) {
    return <XCircle className="w-3 h-3 text-red-500" />;
  }
  if (event.type.includes('completed')) {
    return <CheckCircle className="w-3 h-3 text-green-500" />;
  }
  if (event.type.includes('executing') || event.type.includes('creating')) {
    return <Loader className="w-3 h-3 text-blue-500 animate-spin" />;
  }
  if (event.type === 'sandbox:created') {
    return <CheckCircle className="w-3 h-3 text-green-500" />;
  }
  if (event.type.includes('command')) {
    return <Play className="w-3 h-3 text-purple-500" />;
  }
  return <Hammer className="w-3 h-3 text-blue-500" />;
};
