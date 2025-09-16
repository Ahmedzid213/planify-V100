import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index({ auth, notifications }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Notifications
        </h2>
      }
    >
      <Head title="Notifications" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="border-b last:border-b-0 py-4"
                  >
                    {notification.type === "new_project" && (
                      <p>
                        New project created:{" "}
                        <strong>{notification.data.project_name}</strong>
                      </p>
                    )}
                    {notification.type === "new_task" && (
                      <p>
                        New task created:{" "}
                        <strong>{notification.data.task_name}</strong>
                      </p>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
