<?php

namespace App\Providers;

use App\Models\Industry;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Solution;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureAuthorization();
        $this->configureRateLimiting();
        $this->configureMorphMap();
        $this->shareSiteSettingsWithRootView();
    }

    /**
     * Give the root Blade view the site name, favicon and SEO defaults for the <head>.
     */
    protected function shareSiteSettingsWithRootView(): void
    {
        View::composer('app', function ($view): void {
            $view->with('siteSettings', [...SiteSetting::values(), ...SiteSetting::fileUrls()]);
        });
    }

    /**
     * Short aliases for polymorphic FAQ owners. Not enforced, so existing
     * notification records that store class names keep working.
     */
    protected function configureMorphMap(): void
    {
        Relation::morphMap([
            'service' => Service::class,
            'industry' => Industry::class,
            'solution' => Solution::class,
        ]);
    }

    /**
     * Define who may access the admin panel.
     */
    protected function configureAuthorization(): void
    {
        Gate::define('access-admin', fn (User $user): bool => $user->is_admin);
    }

    /**
     * Limit public form submissions to prevent spam.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('consultation', fn (Request $request): Limit => Limit::perMinute(5)->by($request->ip()));
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
