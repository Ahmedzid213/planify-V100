import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";

export default function About({ auth }) {
  // Choose the layout based on whether the user is logged in
  const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

  return (
    <Layout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          About Us
        </h2>
      }
    >
      <Head title="About Us" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 md:p-12 text-gray-900 dark:text-gray-100">
              <h1 className="text-3xl font-bold mb-4 text-center">
                Meet the Team
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 text-center">
                We are a passionate team dedicated to creating the best project
                management tools.
              </p>

              {/* Team Member Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Replace with your actual team member info */}
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-300 dark:bg-gray-700">
                    {/* You can place an <img /> tag here */}
                  </div>
                  <h3 className="text-xl font-semibold">ZID AHMED</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    FULL STACK Developer
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-300 dark:bg-gray-700"></div>
                  <h3 className="text-xl font-semibold">FADLA WAIL</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    FULL STACK Developer
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-300 dark:bg-gray-700"></div>
                  <h3 className="text-xl font-semibold">Team Member 3</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Project Manager
                  </p>
                </div>
              </div>

              {/* Our Mission Section */}
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Our Mission
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-center">
                  Our mission is to empower teams to achieve their goals by
                  providing intuitive, flexible, and powerful project management
                  software. We believe that with the right tools, any team can
                  accomplish amazing things.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
