<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Promote an existing user to ADMIN, or create a new admin account from
 * scratch with --create. Usage:
 *
 *   php artisan admin:promote you@gmail.com
 *   php artisan admin:promote you@gmail.com --create --password=Str0ngPass
 */
class PromoteAdminCommand extends Command
{
    protected $signature = 'admin:promote
                            {email : The email of the user to promote}
                            {--create : Create a new user if none exists}
                            {--password= : Password when creating a new user}
                            {--name= : Full name when creating a new user}';

    protected $description = 'Promote an existing user to ADMIN, or create a fresh admin account';

    public function handle(): int
    {
        $email = strtolower(trim($this->argument('email')));
        $user = User::query()->where('email', $email)->first();

        if (! $user) {
            if (! $this->option('create')) {
                $this->error("No user with email {$email}. Pass --create to make a new admin.");
                return self::FAILURE;
            }

            $password = $this->option('password') ?: Str::random(12);
            $name = $this->option('name') ?: 'IES Administrator';
            $username = 'admin' . Str::random(6);

            $user = new User();
            $user->id = (string) Str::uuid();
            $user->username = strtolower($username);
            $user->email = $email;
            $user->fullName = $name;
            $user->passwordHash = Hash::make($password);
            $user->role = 'ADMIN';
            $user->save();

            $this->info("Created admin user:");
            $this->line("  Username: {$user->username}");
            $this->line("  Email:    {$user->email}");
            $this->line("  Password: {$password}");
            $this->warn('Save this password — it is not stored in plain text.');
            return self::SUCCESS;
        }

        if ($user->role === 'ADMIN') {
            $this->info("{$email} is already an ADMIN.");
            return self::SUCCESS;
        }

        $user->role = 'ADMIN';
        $user->save();

        $this->info("Promoted {$email} to ADMIN.");
        return self::SUCCESS;
    }
}
