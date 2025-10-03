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
            $table->string('client_name')->nullable();
            $table->string('client_address')->nullable();
            $table->string('client_phone')->nullable();
            $table->string('client_email')->nullable();
            $table->date('start_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'client_name',
                'client_address',
                'client_phone',
                'client_email',
                'start_date',
            ]);
        });
    }
};
