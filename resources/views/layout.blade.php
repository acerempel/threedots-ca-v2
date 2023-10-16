<!DOCTYPE html>
<html lang="en_CA">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $page->title ?? "Good evening" }} … ‹three dots›</title>
    @vite(['resources/js/main.ts', 'resources/sass/main.scss'])
    <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/Vollkorn-Regular.woff2" crossorigin="anonymous">
    @if( $response_code == 200 )<link rel="canonical" href="{{ $meta->base_url }}{{ $page->url }}">@endif
    <meta name="google-site-verification" content="DhZUgJjUNSRFdHhycAzNuCiTKprn-1Csb49PU1lsABo">
    <meta name="color-scheme" content="light dark">
    @isset($page->description)<meta name="description" content="{{ $page->description }}">@endisset
    <meta name="author" content="{{ $meta->author }}">
    <link rel="alternate" type="application/atom+xml" href="/feed">
  </head>
  <body style="min-height: 100vh" class="colour-scheme-auto pr-1/2 pl-1/2 pb-1/2 pt-1/2 font-size-2 flex column align-center bg-normal colour-normal link-uline link-uline-normal">
    <div style="margin-bottom: auto;">
      <main class="main-grid mt-3/4 mb-2">
        @if( isset($page) && $page->full_width )
        <div class="main-full">
          {!! $template_content !!}
        </div>
        @else
        <div class="main-middle max-width-content">
          {!! $template_content !!}
        </div>
        @endif
      </main>
    </div>
    <footer class="font-size-1 colour-lighter border-top border-rosey-grey bp-2">
      {!! Statamic::tag('partial:settings') !!}
      <p><a href="/subscribe">Subscribe</a></p>
      {!! Statamic::tag('partial:edit_link') !!}
    </footer>
    <script data-goatcounter="https://threedots_ca.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
  </body>
</html>
