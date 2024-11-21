import { useState } from 'react';
import { useUserPermissions } from '../../hooks/usePermissions';
import { User } from '../../services/userService';
import { Permission } from '../../types/permission';
import { Shield, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserPermissionsProps {
  user: User;
  onClose: () => void;
}

export function UserPermissions({ user, onClose }: UserPermissionsProps) {
  const { userPermissions, isLoading, updateUserPermissions } = useUserPermissions(user.id);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    userPermissions?.permissions || []
  );

  const handlePermissionToggle = (permission: Permission) => {
    setSelectedPermissions(prev => {
      const updated = prev.map(p => 
        p.permission_id === permission.permission_id
          ? { ...p, can_access: !p.can_access }
          : p
      );
      return updated;
    });
  };

  const handleSave = () => {
    updateUserPermissions(selectedPermissions);
    onClose();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Permissões do Usuário
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.person.full_name}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {selectedPermissions.map((permission) => (
              <div
                key={permission.permission_id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {permission.description || permission.feature_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {permission.feature_name}
                  </p>
                </div>
                <button
                  onClick={() => handlePermissionToggle(permission)}
                  className={`p-2 rounded-full ${
                    permission.can_access
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                  }`}
                >
                  {permission.can_access ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <X className="h-5 w-5" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}