---
id: home
blueprint: complex_page
title: 'Good evening!'
template: complex
description: 'The website of Alan Rempel, an elliptical human man.'
updated_by: ef566878-06e2-4591-9b05-2130076004d2
updated_at: 1647203537
link_text: 'Three dots'
hide_from_toc: false
blocks:
  -
    quote_content:
      -
        type: paragraph
        content:
          -
            type: text
            text: 'I have a strong propensity in me to begin this chapter very nonsensically, and I will not balk my fancy.—Accordingly I set off thus:'
    quote_source: e6c5b088-3318-4f9e-86a6-236f1984961e
    type: quotation
    enabled: true
    quote_location: 'Chapter 1.XXIII'
    grid_position: grid-col-all
    justification: justify-self-center
  -
    nav_title: 'Table of marks'
    type: navigation
    enabled: true
    nav_struct: marks
    nav_show_children: true
    anchor: contents
    grid_position: grid-col-auto
    justification: none
  -
    nav_title: 'Table of words'
    type: navigation
    enabled: true
    nav_struct: words
    nav_show_children: true
    anchor: contents
    grid_position: grid-col-auto
    justification: none
  -
    items_title: 'Quoi de neuf?'
    items_collections:
      - books
      - posts
    items_max_items: 4
    items_style: grid
    type: items
    enabled: true
    anchor: nouvelles
    grid_position: grid-col-all
    justification: justify-self-stretch
full_width: true
title_centred: true
---
