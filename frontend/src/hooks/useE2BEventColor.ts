import type { E2BEvent } from './useWebSocket';

export const useE2BEventColor = (event: E2BEvent): string => {
  if (event.type.includes('error')) {
    return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30';
  }
  if (event.type.includes('completed') || event.type === 'sandbox:created') {
    return 'text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/30';
  }
  if (event.type.includes('executing') || event.type.includes('creating')) {
    return 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30';
  }
  if (event.type.includes('command')) {
    return 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30';
  }
  return 'text-gray-600 dark:text-gray-400 bg-gray-500/10 border-gray-500/30';
};
