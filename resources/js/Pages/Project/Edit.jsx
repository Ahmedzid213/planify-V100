import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, project, managers }) {
  // ✅ on reçoit managers du contrôleur
  const { data, setData, post, errors } = useForm({
    image: "",
    name: project.name || "",
    status: project.status || "",
    description: project.description || "",
    due_date: project.due_date || "",
    project_manager_id: project.project_manager_id ?? "", // ✅ pré-rempli
    _method: "PUT",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("project.update", project.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Modifier le projet "{project.name}"
          </h2>
        </div>
      }
    >
      <Head title="Projets" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              {project.image_path && (
                <div className="mb-4">
                  <img src={project.image_path} className="w-64" />
                </div>
              )}

              {/* Image */}
              <div>
                <InputLabel
                  htmlFor="project_image_path"
                  value="Image du projet"
                />
                <TextInput
                  id="project_image_path"
                  type="file"
                  name="image"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("image", e.target.files[0])}
                />
                <InputError message={errors.image} className="mt-2" />
              </div>

              {/* Nom */}
              <div className="mt-4">
                <InputLabel htmlFor="project_name" value="Nom du projet" />
                <TextInput
                  id="project_name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData("name", e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              {/* Description */}
              <div className="mt-4">
                <InputLabel
                  htmlFor="project_description"
                  value="Description du projet"
                />
                <TextAreaInput
                  id="project_description"
                  name="description"
                  value={data.description}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("description", e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              {/* Deadline */}
              <div className="mt-4">
                <InputLabel
                  htmlFor="project_due_date"
                  value="Date d'échéance du projet"
                />
                <TextInput
                  id="project_due_date"
                  type="date"
                  name="due_date"
                  value={data.due_date}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("due_date", e.target.value)}
                />
                <InputError message={errors.due_date} className="mt-2" />
              </div>

              {/* Status */}
              <div className="mt-4">
                <InputLabel htmlFor="project_status" value="Statut du projet" />
                <SelectInput
                  name="status"
                  id="project_status"
                  value={data.status}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("status", e.target.value)}
                >
                  <option value="">Sélectionner Statut</option>
                  <option value="pending">En attente</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminé</option>
                </SelectInput>
                <InputError message={errors.status} className="mt-2" />
              </div>

              {/* ✅ Assigned User */}
              <div className="mt-4">
                <InputLabel
                  htmlFor="project_manager_id"
                  value="Utilisateur assigné (Chef de projet)"
                />
                <select
                  id="project_manager_id"
                  name="project_manager_id"
                  value={data.project_manager_id}
                  onChange={(e) =>
                    setData("project_manager_id", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">— None —</option>
                  {managers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
                <InputError
                  message={errors.project_manager_id}
                  className="mt-2"
                />
              </div>

              {/* Boutons */}
              <div className="mt-4 text-right">
                <Link
                  href={route("project.index")}
                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                >
                  Annuler
                </Link>
                <button className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                  Soumettre
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
