<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * T-02 — Initial schema (docs/data-model.md §3, §4 and §9).
 *
 * Six business tables, foreign keys, unique indexes, the
 * ck_item_available_range check and the five seeded categories.
 * No business column has a DEFAULT: values are set by the domain.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('category', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 120)->unique();
        });

        Schema::create('app_user', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('username', 120)->unique();
            $table->string('password_hash', 512);
            $table->string('role', 40);
        });

        Schema::create('customer', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('full_name', 200);
            $table->string('document_number', 30)->unique();
        });

        Schema::create('item', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 150);
            $table->string('description', 300);
            $table->char('reference', 8);
            $table->foreignUuid('category_id')->constrained('category')->restrictOnDelete();
            $table->integer('total_units');
            $table->integer('available_units');
            $table->integer('version');
            $table->string('photo_key', 512)->nullable();
            $table->timestampTz('deleted_at')->nullable();
        });

        Schema::create('rental', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('customer_id')->constrained('customer')->restrictOnDelete();
            $table->foreignUuid('rented_by_user_id')->constrained('app_user')->restrictOnDelete();
            $table->timestampTz('rented_at')->index();
        });

        Schema::create('rental_item', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rental_id')->constrained('rental')->cascadeOnDelete();
            $table->foreignUuid('item_id')->constrained('item')->restrictOnDelete();
            $table->string('item_name', 150);
            $table->char('reference', 8);
            $table->string('category_name', 120); // frozen value, no FK on purpose (ADR-003)
            $table->timestampTz('due_at');
            $table->timestampTz('returned_at')->nullable();
            $table->unique(['rental_id', 'item_id']);
            $table->index('item_id');
        });

        // Rules the Schema Builder cannot express (ADR-001: they live in this same migration).
        DB::statement('ALTER TABLE item ADD CONSTRAINT ck_item_available_range
            CHECK (available_units >= 0 AND available_units <= total_units)');
        DB::statement('CREATE UNIQUE INDEX ux_item_reference_active ON item (reference) WHERE deleted_at IS NULL');
        DB::statement('CREATE INDEX ix_item_category_name_active ON item (category_id, name) WHERE deleted_at IS NULL');
        DB::statement('CREATE INDEX ix_rental_item_due_open ON rental_item (due_at) WHERE returned_at IS NULL');

        // Seed: the five fixed categories (data-model.md §9).
        DB::table('category')->insert([
            ['id' => '11111111-1111-4111-8111-111111111111', 'name' => 'Carpas'],
            ['id' => '22222222-2222-4222-8222-222222222222', 'name' => 'Dormir'],
            ['id' => '33333333-3333-4333-8333-333333333333', 'name' => 'Cocina'],
            ['id' => '44444444-4444-4444-8444-444444444444', 'name' => 'Iluminación'],
            ['id' => '55555555-5555-4555-8555-555555555555', 'name' => 'Mochilas'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_item');
        Schema::dropIfExists('rental');
        Schema::dropIfExists('item');
        Schema::dropIfExists('customer');
        Schema::dropIfExists('app_user');
        Schema::dropIfExists('category');
    }
};
