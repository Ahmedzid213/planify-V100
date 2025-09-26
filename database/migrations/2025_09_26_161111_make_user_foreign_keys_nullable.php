<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Allow project_manager_id, created_by, and updated_by to be nullable
            $table->foreignId('project_manager_id')->nullable()->change();
            $table->foreignId('created_by')->nullable()->change();
            $table->foreignId('updated_by')->nullable()->change();
        });

        Schema::table('tasks', function (Blueprint $table) {
            // Allow assigned_user_id, created_by, and updated_by to be nullable
            $table->foreignId('assigned_user_id')->nullable()->change();
            $table->foreignId('created_by')->nullable()->change();
            $table->foreignId('updated_by')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Revert the changes (optional, but good practice)
            $table->foreignId('project_manager_id')->nullable(false)->change();
            $table->foreignId('created_by')->nullable(false)->change();
            $table->foreignId('updated_by')->nullable(false)->change();
        });

        Schema::table('tasks', function (Blueprint $table) {
            // Revert the changes
            $table->foreignId('assigned_user_id')->nullable(false)->change();
            $table->foreignId('created_by')->nullable(false)->change();
            $table->foreignId('updated_by')->nullable(false)->change();
        });
    }
};