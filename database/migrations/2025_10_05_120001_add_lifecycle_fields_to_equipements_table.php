<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $columns = [
            'next_maintenance_due_at' => fn (Blueprint $table) => $table->date('next_maintenance_due_at')->nullable(),
            'next_calibration_due_at' => fn (Blueprint $table) => $table->date('next_calibration_due_at')->nullable(),
            'maintenance_interval_days' => fn (Blueprint $table) => $table->unsignedInteger('maintenance_interval_days')->nullable(),
            'calibration_interval_days' => fn (Blueprint $table) => $table->unsignedInteger('calibration_interval_days')->nullable(),
            'last_maintenance_completed_at' => fn (Blueprint $table) => $table->date('last_maintenance_completed_at')->nullable(),
            'last_calibration_completed_at' => fn (Blueprint $table) => $table->date('last_calibration_completed_at')->nullable(),
        ];

        foreach ($columns as $column => $definition) {
            if (! Schema::hasColumn('equipements', $column)) {
                Schema::table('equipements', function (Blueprint $table) use ($definition) {
                    $definition($table);
                });
            }
        }

        if (Schema::hasColumn('equipements', 'status')) {
            DB::table('equipements')
                ->whereNull('status')
                ->update(['status' => 'in_service']);

            DB::table('equipements')
                ->where('status', 'available')
                ->update(['status' => 'in_service']);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $columns = [
            'next_maintenance_due_at',
            'next_calibration_due_at',
            'maintenance_interval_days',
            'calibration_interval_days',
            'last_maintenance_completed_at',
            'last_calibration_completed_at',
        ];

        foreach ($columns as $column) {
            if (Schema::hasColumn('equipements', $column)) {
                Schema::table('equipements', function (Blueprint $table) use ($column) {
                    $table->dropColumn($column);
                });
            }
        }
    }
};