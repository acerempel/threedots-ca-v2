<!DOCTYPE html>
<html lang="en_CA">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $page->title ?? "Good evening" }} … ‹three dots›</title>
    @vite
    <template id="fancyFonts">
      <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/Vollkorn-Regular.woff2" crossorigin="anonymous">
    </template>
    <script>
      'use strict';
      if(localStorage.getItem('fonts')==='fancy') document.head.appendChild(document.getElementById('fancyFonts').content);
    </script>
    <link rel="canonical" href="{{ $meta->base_url }}{{ $page->url }}">
    <meta name="google-site-verification" content="DhZUgJjUNSRFdHhycAzNuCiTKprn-1Csb49PU1lsABo">
    <meta name="color-scheme" content="light dark">
    @isset($page->description)<meta name="description" content="{{ $page->description }}">@endisset
    <meta name="author" content="{{ $meta->author }}">
    <link rel="alternate" type="application/atom+xml" href="/feed">
  </head>
  <body style="min-height: 100vh" class="colour-scheme-auto pr-1/2 pl-1/2 pb-1/2 pt-1/2 font-size-2 flex column align-center ">
    <div style="margin-bottom: auto;">
      @if ($page->url != "/")
      <header id="header-nav" class="sans-serif main-grid mt-1/2">
        <nav class="main-middle">
          <ol class="link-uline list-none lowercase flex row wrap">
            @foreach( Statamic::tag('nav:breadcrumbs')->include_home(true) as $nav_item )
            <li class="mb-0 font-size-1">
              {!! Statamic::tag('partial:nav-item')->context($nav_item) !!}
              @unless( $loop->last )<span class="mr-1/4 ml-1/4 colour-highlight">／</span>@endunless
            </li>
            @endforeach
          </ol>
        </nav>
      </header>
      @endif
      <main class="main-grid mt-3/4 mb-1">
        @if( $page->full_width )
        <div class="main-full">
          {!! $template_content !!}
        </div>
        @else
        <div class="main-middle max-width-content">
          {!! $template_content !!}
        </div>
        <aside class="sans-serif main-right">
          {!! Statamic::tag('yield:footer') !!}
        </aside>
        @endif
      </main>
    </div>
      <footer id="footer-nav" class="main-grid font-size-1" style="--base-font-size:1rem">
        <div class="@if( $page->full_width ) main-full @else main-middle @endif border-top bp-3/2 mt-1/2 regular sans-serif flex space-between row wrap ">
          <nav
              style="flex-grow: 1; grid-template-columns: repeat(auto-fit, calc(4 * var(--base-line-height)))"
              class="grid col-gap-1/2"
              aria-label="Primary"
            >
            @foreach( Statamic::tag('nav:footer') as $nav_item )
            <section class="mb-1/2">
              <h2 class="mt-0 mb-1/4 semibold font-size-1">{{ $nav_item['title'] }}</h2>
              <ul class="list-none">
                @foreach( $nav_item['children'] as $child )
                <li>{!! Statamic::tag('partial:nav-item')->context($child) !!}</li>
                @endforeach
              </ul>
            </section>
            @endforeach
          </nav>
          <section>
            <h2 class="visually-hidden">Settings</h2>
            {!! Statamic::tag('partial:settings') !!}
          </section>
        </div>
      </footer>
      <script>
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            for (entry of entries) {
              entry.target.classList.toggle('visible', entry.isIntersecting);
              entry.target.classList.toggle('invisible', !entry.isIntersecting);
            }
          }, { rootMargin: "-16px 0px -16px 0px" });
          const footer = document.getElementById('footer-nav');
          const header = document.getElementById('header-nav');
          observer.observe(footer);
          if (header) observer.observe(header);
        }
      </script>
    <script data-goatcounter="https://threedots_ca.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
    <!-- Cloudflare Web Analytics -->
    <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "574870fc954f44ebb9f916bc19706485"}'></script>
    <!-- End Cloudflare Web Analytics -->
  </body>
</html>
