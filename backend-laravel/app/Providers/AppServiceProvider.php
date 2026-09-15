<?php

namespace App\Providers;

use App\Support\RuntimeConfigValidator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(RuntimeConfigValidator::class);
    }

    public function boot(): void
    {
        $this->app->make(RuntimeConfigValidator::class)->validate();
    }
}
