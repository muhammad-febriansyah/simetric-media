<?php

namespace App\Http\Requests\Admin;

use App\Concerns\PasswordValidationRules;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Validator;

class UserRequest extends FormRequest
{
    use PasswordValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('access-admin') ?? false;
    }

    /**
     * Get the validation rules that apply to the request. The password is required when
     * creating and optional when editing.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var User|null $editedUser */
        $editedUser = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users', 'email')->ignore($editedUser)],
            'password' => $editedUser
                ? ['nullable', 'string', Password::default(), 'confirmed']
                : $this->passwordRules(),
            'is_admin' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Admins cannot revoke their own admin access. Runs even when the checkbox
     * is unchecked (and therefore missing from the request).
     *
     * @return array<int, Closure(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                /** @var User|null $editedUser */
                $editedUser = $this->route('user');

                if ($editedUser?->is($this->user()) && ! $this->boolean('is_admin')) {
                    $validator->errors()->add('is_admin', 'Anda tidak bisa mencabut akses admin akun Anda sendiri.');
                }
            },
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'Nama',
            'email' => 'Email',
            'password' => 'Password',
            'is_admin' => 'Akses admin',
        ];
    }
}
