import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Checkbox from "@/Components/Checkbox";

export default function TaskChecklist({ task, authUser }) {
  const [items, setItems] = useState(task.checklists ?? []);
  const [newLabel, setNewLabel] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyIds, setBusyIds] = useState(new Set());
  const serializedChecklists = useMemo(
    () => JSON.stringify(task.checklists ?? []),
    [task.checklists]
  );

  useEffect(() => {
    setItems(task.checklists ?? []);
  }, [task.id, serializedChecklists]);

  const completionSummary = useMemo(() => {
    if (!items.length) {
      return "No items";
    }

    const completed = items.filter((item) => item.is_checked).length;
    return `${completed} / ${items.length} done`;
  }, [items]);

  const canManage = useMemo(() => {
    if (!authUser) {
      return false;
    }

    const elevatedRoles = ["technical manager", "admin"];
    const isElevated = elevatedRoles.includes(authUser.role);
    const isProjectManager =
      task.project?.project_manager_id === authUser.id ||
      task.project?.manager?.id === authUser.id;
    const assignedUserId = task.assigned_user_id ?? task.assignedUser?.id;
    const isAssignedUser = assignedUserId === authUser.id;

    return isElevated || isProjectManager || isAssignedUser;
  }, [authUser, task]);

  const updateBusyIds = (updater) => {
    setBusyIds((previous) => {
      const next = new Set(previous);
      updater(next);
      return next;
    });
  };

  const handleAddItem = async (event) => {
    event.preventDefault();

    const label = newLabel.trim();

    if (!label) {
      setFormError("Please enter a label.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const response = await axios.post(
        route("tasks.checklists.store", { task: task.id }),
        { label }
      );

      setItems((prev) => [...prev, response.data]);
      setNewLabel("");
    } catch (error) {
      setFormError(
        error.response?.data?.message ?? "Unable to add this item."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (item) => {
    if (!canManage || busyIds.has(item.id)) {
      return;
    }

    const nextValue = !item.is_checked;
    updateBusyIds((set) => set.add(item.id));
    setFormError("");
    setItems((prev) =>
      prev.map((current) =>
        current.id === item.id
          ? { ...current, is_checked: nextValue }
          : current
      )
    );

    try {
      const { data } = await axios.patch(
        route("tasks.checklists.update", {
          task: task.id,
          checklistItem: item.id,
        }),
        { is_checked: nextValue }
      );

      setItems((prev) =>
        prev.map((current) => (current.id === item.id ? data : current))
      );
    } catch (error) {
      setItems((prev) =>
        prev.map((current) =>
          current.id === item.id
            ? { ...current, is_checked: !nextValue }
            : current
        )
      );
      setFormError(
        error.response?.data?.message ?? "Unable to update this item."
      );
    } finally {
      updateBusyIds((set) => set.delete(item.id));
    }
  };

  const handleDelete = async (item) => {
    if (!canManage || busyIds.has(item.id)) {
      return;
    }

    if (!window.confirm("Remove this checklist item?")) {
      return;
    }

    updateBusyIds((set) => set.add(item.id));
    setFormError("");

    try {
      await axios.delete(
        route("tasks.checklists.destroy", {
          task: task.id,
          checklistItem: item.id,
        })
      );

      setItems((prev) => prev.filter((current) => current.id !== item.id));
    } catch (error) {
      setFormError(
        error.response?.data?.message ?? "Unable to delete this item."
      );
    } finally {
      updateBusyIds((set) => set.delete(item.id));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Checklist
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completionSummary}
          </span>
        </div>

        {formError && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        {items.length > 0 ? (
          <ul className="space-y-2">
            {items.map((item) => {
              const isBusy = busyIds.has(item.id);
              return (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900/40"
                >
                  <label className="flex flex-1 items-start gap-3">
                    <Checkbox
                      checked={Boolean(item.is_checked)}
                      onChange={() => handleToggle(item)}
                      disabled={!canManage || isBusy}
                      className={!canManage ? "cursor-default" : "cursor-pointer"}
                    />
                    <span
                      className={`text-sm leading-6 text-gray-700 dark:text-gray-200 ${
                        item.is_checked ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </label>

                  {canManage && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={isBusy}
                      className="rounded p-1 text-gray-400 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M8.75 3a1 1 0 00-.97.757L7.5 4H5a1 1 0 100 2h10a1 1 0 100-2h-2.5l-.28-.243A1 1 0 0011.25 3h-2.5z" />
                        <path
                          fillRule="evenodd"
                          d="M5.5 6h9l-.4 8.077A2 2 0 0012.108 16H7.892a2 2 0 01-1.992-1.923L5.5 6zm3 2a.75.75 0 00-1.5 0v5a.75.75 0 001.5 0V8zm3 0a.75.75 0 00-1.5 0v5a.75.75 0 001.5 0V8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No checklist items yet.
          </p>
        )}

        {canManage && (
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleAddItem}>
            <input
              type="text"
              value={newLabel}
              onChange={(event) => setNewLabel(event.target.value)}
              placeholder="Add a checklist item"
              className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Add
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
