<?php

namespace App\Support;

final class AuthValidation
{
    public const USERNAME_REGEX = '/^(?=.{3,32}$)[a-z0-9]+$/i';

    public const USERNAME_ERROR =
        'Username: 3-32 letters or numbers only.';

    public const GMAIL_EMAIL_REGEX = '/^[a-z0-9._%+-]+@gmail\.com$/i';

    public const GMAIL_EMAIL_ERROR = 'Email must end with @gmail.com.';

    public const SECURE_PASSWORD_REGEX = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\\\|,.<>\/?`~]).{8,16}$/';

    public const SECURE_PASSWORD_ERROR =
        'Password: 8-16 characters, must include uppercase, lowercase, number, and symbol.';

    private function __construct()
    {
    }
}
