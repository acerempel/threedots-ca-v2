<?php

namespace App\Tags;

use Statamic\Tags\Tags;
use Statamic\Facades\Entry;

class GroupedByDate extends Tags
{
    /**
     * The {{ grouped_by_date }} tag. This works exactly like the {{
     * grouped_by_date:* }} tag, except that the date property by which to group
     * the entries is given in the `property` parameter rather in the handle
     * (the part after the colon).
     *
     * @return array
     */
    public function index() {
      return $this->wildcard($this->params->get('property'));
    }

    /**
     * The {{ grouped_by_date:* }} tag. The part after the colon is the property you
     * want to key the groups by.
     *
     * The `collection` or `from` parameter specifies the collection from which
     * come the items to be grouped. It defaults to 'pages' if not specified.
     *
     * The `sort_entries` or `sort` parameter specifies by what property the
     * entries shall be ordered and in what direction, in the format
     * `$property:$dir`, eg `sort='title:asc'`. It defaults to `'date:desc'`.
     *
     * The groups are sorted by the grouping property. Use the `sort_groups_dir`
     * parameter` to specify whether they should be sorted ascending (`asc`) or
     * descending (`desc`). The default is whatever the sort direction is for
     * the entries, which itself defaults to `desc`.
     *
     * @return array
     */
    public function wildcard($property) {
      $collection = $this->params->get(['collection', 'from'], 'pages');

      $entries_order = $this->params->get(['sort_entries', 'sort'], 'date:desc');
      [$entries_order_prop, $entries_order_dir] = explode(':', $entries_order);

      $groups_order_dir = $this->params->get(['sort_groups_dir'], $entries_order_dir);

      $date_properties = ['year', 'month', 'day', 'hour', 'minute', 'second', 'dayOfWeek'];
      if (in_array($property, $date_properties)) {
        $group_by_property = function ($item) use ($property) {
          return $item->date()->{$property};
        };
      } else {
        $group_by_property = $property;
      }

      return Entry::query()
        ->where('collection', $collection)
        ->orderBy($entries_order_prop, $entries_order_dir)
        ->get()
        ->groupBy($group_by_property)
        ->map(function ($item, $key) use ($property) {
          $group = [];
          $group['entries'] = $item;
          $group['group'] = $key; $group[$property] = $key;
          return $group;
        })
        ->sortBy([['group', $groups_order_dir]])
        ->all();
    }
}
