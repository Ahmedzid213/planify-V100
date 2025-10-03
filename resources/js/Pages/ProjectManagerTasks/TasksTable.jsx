import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import TableHeading from "@/Components/TableHeading";
import {
  TASK_PRIORITY_CLASS_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_CLASS_MAP,
  TASK_STATUS_TEXT_MAP,
} from "@/constants.jsx";
import { Link, router } from "@inertiajs/react";

export default function TasksTable({
  tasks,
  success,
  filters = {},
  baseRoute = "project-manager.tasks",
  showProjectColumn = true,
  showCreatedByColumn = true,
  showActions = true,
  enableFilters = true,
}) {
  const currentFilters = { ...filters };

  const refresh = (params) => {
    router.get(route(`${baseRoute}.index`), params, {
      preserveState: true,
      replace: true,
    });
  };

  const updateFilter = (name, value) => {
    if (!enableFilters) {
      return;
    }

    const params = { ...currentFilters };

    if (value) {
      params[name] = value;
    } else {
      delete params[name];
    }

    refresh(params);
  };

  const onKeyPress = (name, event) => {
    if (event.key !== "Enter") {
      return;
    }

    updateFilter(name, event.target.value.trim());
  };

  const sortChanged = (name) => {
    if (!enableFilters) {
      return;
    }

    const params = { ...currentFilters };

    if (params.sort_field === name) {
      params.sort_direction = params.sort_direction === "asc" ? "desc" : "asc";
    } else {
      params.sort_field = name;
      params.sort_direction = "asc";
    }

    refresh(params);
  };

  const deleteTask = (task) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    router.delete(route(`${baseRoute}.destroy`, task.id));
  };

  const priorityPill = (task) => {
    const priorityClass = TASK_PRIORITY_CLASS_MAP[task.priority] ?? "bg-gray-500";
    const priorityLabel = TASK_PRIORITY_TEXT_MAP[task.priority] ?? (task.priority || "Unknown");

    return (
      <span className={`px-2 py-1 rounded text-white ${priorityClass}`}>
        {priorityLabel}
      </span>
    );
  };

  const statusPill = (task) => {
    const statusClass = TASK_STATUS_CLASS_MAP[task.status] ?? "bg-gray-500";
    const statusLabel = TASK_STATUS_TEXT_MAP[task.status] ?? (task.status || "Unknown");

    return (
      <span className={`px-2 py-1 rounded text-white ${statusClass}`}>
        {statusLabel}
      </span>
    );
  };

  return (
    <>
      {success && (
        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
          {success}
        </div>
      )}

      <div className="overflow-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300 border-b-2 border-gray-500">
            <tr className="text-nowrap">
              <TableHeading
                name="id"
                sort_field={currentFilters.sort_field}
                sort_direction={currentFilters.sort_direction}
                sortChanged={sortChanged}
              >
                ID
              </TableHeading>
              <th className="px-3 py-3">Attachment</th>
              {showProjectColumn && <th className="px-3 py-3">Project</th>}
              <TableHeading
                name="name"
                sort_field={currentFilters.sort_field}
                sort_direction={currentFilters.sort_direction}
                sortChanged={sortChanged}
              >
                Name
              </TableHeading>
              <TableHeading
                name="status"
                sort_field={currentFilters.sort_field}
                sort_direction={currentFilters.sort_direction}
                sortChanged={sortChanged}
              >
                Status
              </TableHeading>
              <TableHeading
                name="priority"
                sort_field={currentFilters.sort_field}
                sort_direction={currentFilters.sort_direction}
                sortChanged={sortChanged}
              >
                Priority
              </TableHeading>
              <TableHeading
                name="created_at"
                sort_field={currentFilters.sort_field}
                sort_direction={currentFilters.sort_direction}
                sortChanged={sortChanged}
              >
                Created
              </TableHeading>
              <TableHeading
                name="due_date"
                sort_field={currentFilters.sort_field}
                sort_direction={currentFilters.sort_direction}
                sortChanged={sortChanged}
              >
                Due
              </TableHeading>
              {showCreatedByColumn && <th className="px-3 py-3">Created by</th>}
              <th className="px-3 py-3">Assigned to</th>
              {showActions && <th className="px-3 py-3 text-right">Actions</th>}
            </tr>
          </thead>

          {enableFilters && (
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300 border-b-2 border-gray-500">
              <tr className="text-nowrap">
                <th className="px-3 py-3"></th>
                <th className="px-3 py-3"></th>
                {showProjectColumn && <th className="px-3 py-3"></th>}
                <th className="px-3 py-3">
                  <TextInput
                    className="w-full"
                    defaultValue={currentFilters.name}
                    placeholder="Search by name"
                    onBlur={(event) => updateFilter("name", event.target.value.trim())}
                    onKeyPress={(event) => onKeyPress("name", event)}
                  />
                </th>
                <th className="px-3 py-3">
                  <SelectInput
                    className="w-full"
                    defaultValue={currentFilters.status}
                    onChange={(event) => updateFilter("status", event.target.value)}
                  >
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In progress</option>
                    <option value="completed">Completed</option>
                  </SelectInput>
                </th>
                <th className="px-3 py-3">
                  <SelectInput
                    className="w-full"
                    defaultValue={currentFilters.priority}
                    onChange={(event) => updateFilter("priority", event.target.value)}
                  >
                    <option value="">All priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </SelectInput>
                </th>
                <th className="px-3 py-3"></th>
                <th className="px-3 py-3"></th>
                {showCreatedByColumn && <th className="px-3 py-3"></th>}
                <th className="px-3 py-3"></th>
                {showActions && <th className="px-3 py-3"></th>}
              </tr>
            </thead>
          )}

          <tbody>
            {tasks.data.map((task) => (
              <tr key={task.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-3 py-2">{task.id}</td>
                <td className="px-3 py-2">
                  {task.image_path ? (
                    <a
                      href={task.image_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-500"
                    >
                      View file
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                {showProjectColumn && (
                  <td className="px-3 py-2 text-nowrap">
                    {task.project ? (
                      <Link
                        href={route('project.show', task.project.id)}
                        className="text-emerald-600 hover:text-emerald-500"
                      >
                        {task.project.name}
                      </Link>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                )}
                <th className="px-3 py-2 text-gray-900 dark:text-gray-100">
                  <Link href={route(`${baseRoute}.show`, task.id)} className="hover:underline">
                    {task.name}
                  </Link>
                </th>
                <td className="px-3 py-2">{statusPill(task)}</td>
                <td className="px-3 py-2">{priorityPill(task)}</td>
                <td className="px-3 py-2 text-nowrap">{task.created_at}</td>
                <td className="px-3 py-2 text-nowrap">{task.due_date ?? "Not set"}</td>
                {showCreatedByColumn && (
                  <td className="px-3 py-2 text-nowrap">
                    {task.createdBy ? task.createdBy.name : "—"}
                  </td>
                )}
                <td className="px-3 py-2 text-nowrap">
                  {task.assignedUser ? task.assignedUser.name : "Unassigned"}
                </td>
                {showActions && (
                  <td className="px-3 py-2 text-nowrap text-right">
                    <Link
                      href={route(`${baseRoute}.edit`, task.id)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteTask(task)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination links={tasks.meta.links} />
    </>
  );
}
