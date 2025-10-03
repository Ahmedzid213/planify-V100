import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, task, projects, users }) {
  const { data, setData, post, processing, errors } = useForm({
    _method: "PUT",
    project_id: task.project_id || "",
    image: null,
    name: task.name || "",
    description: task.description || "",
    due_date: task.due_date || "",
    status: task.status || "",
    priority: task.priority || "",
    assigned_user_id: task.assigned_user_id || "",
  });

  const onSubmit = (event) => {
    event.preventDefault();
    post(route("project-manager.tasks.update", task.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Edit task "{task.name}"
          </h2>
        </div>
      }
    >
      <Head title={`Edit ${task.name}`} />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className="p-6 space-y-6">
              <div>
                <InputLabel htmlFor="task_project_id" value="Project" />
                <SelectInput
                  id="task_project_id"
                  name="project_id"
                  value={data.project_id}
                  className="mt-1 block w-full"
                  onChange={(event) => setData("project_id", event.target.value)}
                >
                  <option value="">Select a project</option>
                  {projects.data.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </SelectInput>
                <InputError message={errors.project_id} className="mt-2" />
              </div>

              <div className="space-y-2">
                <InputLabel htmlFor="task_file" value="Attachment" />
                {task.image_path && (
                  <div className="rounded border border-dashed border-gray-300 p-3 text-sm text-gray-500">
                    <a
                      href={task.image_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-500"
                    >
                      View current file
                    </a>
                  </div>
                )}
                <TextInput
                  id="task_file"
                  type="file"
                  name="image"
                  className="mt-1 block w-full"
                  onChange={(event) => setData("image", event.target.files[0])}
                />
                <InputError message={errors.image} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="task_name" value="Task name" />
                <TextInput
                  id="task_name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-1 block w-full"
                  isFocused
                  onChange={(event) => setData("name", event.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="task_description" value="Description" />
                <TextAreaInput
                  id="task_description"
                  name="description"
                  value={data.description}
                  className="mt-1 block w-full"
                  onChange={(event) => setData("description", event.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <InputLabel htmlFor="task_due_date" value="Due date" />
                  <TextInput
                    id="task_due_date"
                    type="date"
                    name="due_date"
                    value={data.due_date}
                    className="mt-1 block w-full"
                    onChange={(event) => setData("due_date", event.target.value)}
                  />
                  <InputError message={errors.due_date} className="mt-2" />
                </div>
                <div>
                  <InputLabel htmlFor="task_status" value="Status" />
                  <SelectInput
                    id="task_status"
                    name="status"
                    value={data.status}
                    className="mt-1 block w-full"
                    onChange={(event) => setData("status", event.target.value)}
                  >
                    <option value="">Select a status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In progress</option>
                    <option value="completed">Completed</option>
                  </SelectInput>
                  <InputError message={errors.status} className="mt-2" />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <InputLabel htmlFor="task_priority" value="Priority" />
                  <SelectInput
                    id="task_priority"
                    name="priority"
                    value={data.priority}
                    className="mt-1 block w-full"
                    onChange={(event) => setData("priority", event.target.value)}
                  >
                    <option value="">Select a priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </SelectInput>
                  <InputError message={errors.priority} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="task_assigned_user" value="Assign to" />
                  <SelectInput
                    id="task_assigned_user"
                    name="assigned_user_id"
                    value={data.assigned_user_id}
                    className="mt-1 block w-full"
                    onChange={(event) => setData("assigned_user_id", event.target.value)}
                  >
                    <option value="">Select a technician</option>
                    {users.data.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.assigned_user_id} className="mt-2" />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Link
                  href={route("project-manager.tasks.index")}
                  className="bg-gray-100 py-2 px-3 text-gray-800 rounded shadow transition hover:bg-gray-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-emerald-500 py-2 px-3 text-white rounded shadow transition hover:bg-emerald-600 disabled:opacity-50"
                >
                  Update task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
