// Update the imports section to include UserPermissions
import { UserPermissions } from './UserPermissions';

// Add to the state declarations
const [showPermissions, setShowPermissions] = useState(false);

// Add a button to open permissions in the actions area
<button
  onClick={() => setShowPermissions(true)}
  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
>
  <Shield className="h-5 w-5" />
</button>

// Add at the end of the component, just before the closing div
{showPermissions && (
  <UserPermissions
    user={user}
    onClose={() => setShowPermissions(false)}
  />
)}