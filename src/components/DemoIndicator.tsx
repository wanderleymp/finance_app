import { AlertCircle } from 'lucide-react';
import { IS_DEMO, DEMO_MESSAGE } from '../utils/constants';

export function DemoIndicator() {
  if (!IS_DEMO) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-yellow-50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm font-medium">{DEMO_MESSAGE}</span>
      </div>
    </div>
  );
}