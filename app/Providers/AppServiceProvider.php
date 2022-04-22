<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Innocenzi\Vite\Vite;
use Innocenzi\Vite\Chunk;

function make_relative(string $url): string {
  return preg_replace('#^https?://[^/]*#', '', $url);
}

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // Overrides script tag generation
        Vite::makeScriptTagsUsing(function (string $url, Chunk $chunk = null): string {
            if (vite('default')->usesManifest()) {
                $url = make_relative($url);
            }
            return sprintf('<script type="module" src="%s" defer></script>', $url);
        });

        // Overrides style tag generation
        Vite::makeStyleTagsUsing(function (string $url, Chunk $chunk = null): string {
            if (vite('default')->usesManifest()) {
                $url = make_relative($url);
            }
            return sprintf('<link rel="stylesheet" href="%s" crossorigin="anonymous" />', $url);
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Statamic::script('app', 'cp');
        // Statamic::style('app', 'cp');
    }
}
