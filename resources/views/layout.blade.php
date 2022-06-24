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
    @if( $response_code == 200 )<link rel="canonical" href="{{ $meta->base_url }}{{ $page->url }}">@endif
    <meta name="google-site-verification" content="DhZUgJjUNSRFdHhycAzNuCiTKprn-1Csb49PU1lsABo">
    <meta name="color-scheme" content="light dark">
    @isset($page->description)<meta name="description" content="{{ $page->description }}">@endisset
    <meta name="author" content="{{ $meta->author }}">
    <link rel="alternate" type="application/atom+xml" href="/feed">
  </head>
  <body style="min-height: 100vh" class="colour-scheme-auto pr-1/2 pl-1/2 pb-1/2 pt-1/2 font-size-2 flex column align-center ">
    <div style="margin-bottom: auto;">
      <main class="main-grid mt-3/4 mb-1">
        @if( isset($page) && $page->full_width )
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
    @if (! $is_homepage)
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
    <script data-goatcounter="https://threedots_ca.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
  </body>
</html>
