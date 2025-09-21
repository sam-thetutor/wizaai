import React from 'react';
import { useApp } from '../contexts/AppContext';
import Button from './ui/Button';
import { 
  AlertTriangle, 
  X,
  ArrowLeft,
  Save
} from 'lucide-react';

interface LeaveConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSaveAndLeave?: () => void;
  title?: string;
  message?: string;
  hasUnsavedChanges?: boolean;
}

const LeaveConfirmationModal: React.FC<LeaveConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onSaveAndLeave,
  title = "Leave Course?",
  message = "Are you sure you want to leave? Your progress will be saved automatically.",
  hasUnsavedChanges = false
}) => {
  const { state } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-md w-full rounded-xl ${
        state.theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                hasUnsavedChanges ? 'bg-orange-100' : 'bg-blue-100'
              }`}>
                <AlertTriangle className={`h-6 w-6 ${
                  hasUnsavedChanges ? 'text-orange-600' : 'text-blue-600'
                }`} />
              </div>
              <h2 className={`text-xl font-bold ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className={`${
              state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {message}
            </p>
            
            {hasUnsavedChanges && (
              <div className={`mt-4 p-3 rounded-lg border-l-4 border-orange-500 ${
                state.theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50'
              }`}>
                <p className={`text-sm ${
                  state.theme === 'dark' ? 'text-orange-300' : 'text-orange-700'
                }`}>
                  ⚠️ You have unsaved changes that will be lost if you leave now.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            {hasUnsavedChanges && onSaveAndLeave && (
              <Button
                onClick={onSaveAndLeave}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save and Leave
              </Button>
            )}
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Stay
              </Button>
              <Button
                variant={hasUnsavedChanges ? "outline" : "primary"}
                onClick={onConfirm}
                className={`flex-1 ${
                  hasUnsavedChanges 
                    ? 'border-red-300 text-red-700 hover:bg-red-50' 
                    : ''
                }`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {hasUnsavedChanges ? 'Leave Without Saving' : 'Leave'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveConfirmationModal;