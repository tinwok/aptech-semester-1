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

        Schema::table('users', function (Blueprint $table) {
            $table->after('password', function (Blueprint $table) {
                $table->enum('status', ['active', 'inactive', 'blocked'])->default('active');
                $table->boolean('must_change_password')->default(true);
                $table->date('dob')->nullable();
                $table->softDeletes();
                $table->string('phone')->unique();
                $table->enum('role', ['admin', 'staff', 'customer'])->default('customer');
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();

            $table->dropColumn([
                'status',
                'must_change_password',
                'dob',
                'phone',
                'role'
            ]);
        });
    }
};
