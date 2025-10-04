import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

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
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Aucune notification pour le moment.
                </p>
              ) : (
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification.id} className="border-b last:border-b-0 py-4 space-y-1">
                      {notification.type === "new_project" && (
                        <p>
                          Nouveau projet cree : <strong>{notification.data.project_name}</strong>
                        </p>
                      )}

                      {notification.type === "new_task" && (
                        <p>
                          Nouvelle tache creee : <strong>{notification.data.task_name}</strong>
                        </p>
                      )}

                      {notification.type === "task_assigned" && (
                        <p>
                          tache Assignee : <strong>{notification.data.task_name}</strong>
                          {notification.data.project_name && (
                            <span className="text-sm text-gray-500">
                              {" (Projet : " + notification.data.project_name + ")"}
                            </span>
                          )}
                        </p>
                      )}

                      {notification.type === "checklist_completed" && (
                        <p>
                          Checklist completee :
                          <strong className="mx-1">{notification.data.task_name}</strong>
                          par <strong>{notification.data.completed_by}</strong>
                          {notification.data.task_id && (
                            <span className="ml-2 text-sm text-emerald-500">
                              <Link
                                href={route("project-manager.tasks.show", notification.data.task_id)}
                                className="hover:underline"
                              >
                                Voir la tache
                              </Link>
                            </span>
                          )}
                        </p>
                      )}

                      <span className="block text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
