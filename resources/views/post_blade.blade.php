    <article class="mx-auto h-entry" itemscope itemtype="https://schema.org/BlogPosting">
      <header class="sans-serif">
        <p class="colour-lighter light">
          {{ partial:date :date="date" }}
          @if ($date_revised) 
            <small> – Revised {{ partial:date :date="date_revised" }}</small>
           @endif
        </p>
        @unless ($display_options) 
          <h1 class="title p-name font-size-4.5 semibold" itemprop="headline">{{ title }}</h1>
        @endunless
      </header>
      <div class="e-content prose p-space-1/2" itemprop="articleBody">
        {!! $content !!}
      </div>
    </article>
