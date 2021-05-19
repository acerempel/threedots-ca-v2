<?php

namespace App\Tags;

use Exception;
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
      return $this->wildcard($this->params->explode('property'));
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
     * @param string[] $property
     *
     * @return array[]
     */
    public function wildcard($property) {
      if (! is_array($property)) $property = explode('|', $property);

      $collection = $this->params->get(['collection', 'from'], 'pages');

      $entries_order = $this->params->get(['sort_entries', 'sort'], 'date:desc');
      [$entries_order_prop, $entries_order_dir] = explode(':', $entries_order);

      $groups_order_dir = $this->params->get(['sort_groups_dir'], $entries_order_dir);

      $date_properties = ['year', 'month', 'day', 'hour', 'minute', 'second', 'dayOfWeek'];
      foreach ($property as $prop) {
        if (! in_array($prop, $date_properties)) throw new Exception("Date property unknown!");
      }

      $group_by_property = function ($item) use ($property) {
        $values = array_map(function ($prop) use ($item) {
          return $item->date()->{$prop};
        }, $property);
        return implode('-', $values);
      };

      $reorganize_group = function ($item, $key) use ($property) {
        $group = [ 'entries' => $item, 'group' => $key, ];
        $date = $item[0]->date();
        foreach ($property as $prop) {
          $group[$prop] = $date->{$prop};
        }
        return $group;
      };

      return Entry::query()
        ->where('collection', $collection)
        ->orderBy($entries_order_prop, $entries_order_dir)
        ->get()
        ->groupBy($group_by_property)
        ->map($reorganize_group)
        ->sortBy([['group', $groups_order_dir]])
        ->all();
    }
}
