import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer } from 'lucide-react';
import type { E2BEvent } from '../../hooks/useWebSocket';
import { E2BEventItem } from './E2BEventItem';

interface E2BEventListProps {
  events: E2BEvent[];
  maxVisible?: number;
  showHeader?: boolean;
}

export const E2BEventList: React.FC<E2BEventListProps> = ({
  events,
  maxVisible = 5,
  showHeader = true,
}) => {
  if (events.length === 0) {
    return null;
  }

  const visibleEvents = events.slice(-maxVisible);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 space-y-2"
    >
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs font-semibold text-muted-foreground mb-2 flex items-center space-x-2"
        >
          <Hammer className="w-3 h-3" />
          <span>Building Activity</span>
        </motion.div>
      )}
      <AnimatePresence mode="sync">
        {visibleEvents.map((event, index) => (
          <motion.div
            key={`${event.timestamp}-${index}`}
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{
              opacity: 1,
              y: 0,
              height: 'auto',
              transition: {
                duration: 0.3,
                delay: index * 0.15,
                ease: "easeOut"
              }
            }}
            exit={{ opacity: 0, height: 0 }}
          >
            <E2BEventItem event={event} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
