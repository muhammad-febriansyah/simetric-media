<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

#[Signature('app:create-admin-user {--name= : Nama admin} {--email= : Email untuk login}')]
#[Description('Buat akun admin (atau jadikan akun yang ada sebagai admin) dengan password yang diketik langsung, tanpa password bawaan.')]
class CreateAdminUser extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $name = $this->option('name') ?: $this->ask('Nama admin');
        $email = $this->option('email') ?: $this->ask('Email untuk login');
        $password = $this->secret('Password (minimal 8 karakter)');
        $confirmation = $this->secret('Ulangi password');

        $validator = Validator::make(
            ['name' => $name, 'email' => $email, 'password' => $password, 'password_confirmation' => $confirmation],
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255'],
                'password' => ['required', 'string', Password::default(), 'confirmed'],
            ],
            attributes: ['name' => 'Nama', 'email' => 'Email', 'password' => 'Password'],
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $message) {
                $this->error($message);
            }

            return self::FAILURE;
        }

        $user = User::query()->firstOrNew(['email' => $email]);

        if ($user->exists && ! $this->confirm("Akun {$email} sudah ada. Jadikan admin dan ganti password-nya?")) {
            $this->warn('Dibatalkan.');

            return self::FAILURE;
        }

        $user->name = $name;
        $user->password = $password;
        $user->is_admin = true;
        $user->email_verified_at ??= now();
        $user->save();

        $this->info("Admin {$email} siap. Login di ".route('login'));

        return self::SUCCESS;
    }
}
