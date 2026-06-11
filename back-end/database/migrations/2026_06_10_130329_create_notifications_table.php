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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('reference_type')->nullable();
            $table->string('title');
            $table->text('message');
            $table->string('url')->nullable();
            $table->enum('type', [
                'appointment_reminder',
                'staff_schedule',
                'low_inventory',
                'invoice_pending',
                'shift_upcoming'
            ]);
            $table->boolean('is_read')->default(false);
            $table->timestamp('send_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
