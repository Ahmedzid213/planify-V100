// resources/js/Components/FileCard.jsx

import { Link } from "@inertiajs/react";

export default function FileCard({ file, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-4 flex justify-between items-center">
      <a
        href={`/storage/${file.path.replace("public/", "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-900 dark:text-gray-100 hover:underline"
      >
        {file.name}
      </a>
      <button
        onClick={() => onDelete(file)}
        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
      >
        Delete
      </button>
    </div>
  );
}
