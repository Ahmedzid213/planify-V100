// resources/js/Pages/Equipement/Show.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Show({ auth, equipement }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {`Equipement "${equipement.data.name}"`}
        </h2>
      }
    >
      <Head title={`Equipement "${equipement.data.name}"`} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="grid gap-1 grid-cols-2">
                <div>
                  <div>
                    <label className="font-bold text-lg">Equipement ID</label>
                    <p className="mt-1">{equipement.data.id}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Equipement Name</label>
                    <p className="mt-1">{equipement.data.name}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">
                      Equipement Brand
                    </label>
                    <p className="mt-1">{equipement.data.brand}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">
                      Equipement Reference
                    </label>
                    <p className="mt-1">{equipement.data.reference}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">
                      Equipement Serial Number
                    </label>
                    <p className="mt-1">{equipement.data.serial_number}</p>
                  </div>
                </div>
                <div>
                  <div>
                    <label className="font-bold text-lg">Create Date</label>
                    <p className="mt-1">{equipement.data.created_at}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="font-bold text-lg">Equipement Note</label>
                <p className="mt-1">{equipement.data.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
