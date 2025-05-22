<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

/*  ── Models ────────────────────────────────────── */
use App\Models\Post;
use App\Models\Comment;
use App\Models\Report;

/*  ── Policies ──────────────────────────────────── */
use App\Policies\PostPolicy;
use App\Policies\CommentPolicy;
use App\Policies\ReportPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Map every model to its policy.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Post::class    => PostPolicy::class,
        Comment::class => CommentPolicy::class,
        Report::class  => ReportPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        /*
        |------------------------------------------------------------------
        | Additional Gates (optional)
        |------------------------------------------------------------------
        | Gate‑helpers di sini tidak wajib, namun kadang berguna untuk
        | pengecekan sederhana di view (Blade) atau komponen React.
        */

        Gate::define('admin', fn ($user) => $user->roles === 'admin');
    }
}
