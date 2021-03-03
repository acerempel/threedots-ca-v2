<!DOCTYPE html>
<html lang="en_CA">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ title ?? "Good evening" }} … ‹three dots›</title>
    <link rel="stylesheet" href="/assets/build/css/main.css">
    <template id="fancyFonts">
      <link rel="preconnect" href="https://fonts.gstatic.com"> 
      <link href="https://fonts.googleapis.com/css2?family=Vollkorn:ital,wght@0,400;0,600;1,400&family=Palanquin:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    </template>
    <script>
      'use strict';
      function loadFancyFonts() {
        document.head.appendChild(document.getElementById('fancyFonts').content);
        window.fancyFontsLoaded = true;
      }
      if(localStorage.getItem('fonts')==='fancy')loadFancyFonts();
    </script>
    <link rel="canonical" href="{{ permalink }}">
    <meta name="google-site-verification" content="DhZUgJjUNSRFdHhycAzNuCiTKprn-1Csb49PU1lsABo">
    <meta name="color-scheme" content="light dark">
    @if ($description) <meta name="description" content="{{ description }}"> @endif
    <meta name="author" content="Alan Rempel">
    <link rel="alternate" type="application/atom+xml" href="/posts/feed.xml">
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        @php echo file_get_contents('source/assets/build/js/main.js'); @endphp
        @if ($page->has_greeting)
          @php echo file_get_contents('source/_scripts/greeting.js'); @endphp
          set_greetings();
        @endif
        @stack('DOMContentLoaded')
      })
    </script>
  </head>
  <body class="colour-scheme-auto font-size-1">
    <div class="container mx-auto">
      <header class="mt-1 sans-serif">
        <div class="flex row space-between wrap">
          <h1 class="bold font-size-1"><a href="/">three dots …</a></h1>
          @include('_settings')
        </div>
        <nav class="semibold colour-highlight flex row link-plain">
          @nav('collection::pages')
            <a href="{{ $item['url'] }}"
               @if ($item['description']) title="{{ $item['description'] }}" @endif
               @if ($item['type']) type="{{ $item['type'] }}" @endif
               @if ($item['is_current']) aria-current="page" @endif
            >{{ $item['link_text'] ?? $item['title'] }}</a>
            <span class="flex-divider"></span>
          @endnav
        </nav>
      </header>
      <main class="mt-3/4 mb-1">
        @yield('body')
      </main>
    </div>
    <script data-goatcounter="https://threedots_ca.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
  </body>
</html>
