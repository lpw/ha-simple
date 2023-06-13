{% for thing in states.light  -%}
"{{ thing.entity_id }}": "{{ device_id( thing.entity_id ) }}",
{% endfor -%}

{% for thing in states.switch  -%}
"{{ thing.entity_id }}": "{{ device_id( thing.entity_id ) }}",
{% endfor -%}

{% for thing in states.binary_sensor  -%}
"{{ thing.entity_id }}": "{{ device_id( thing.entity_id ) }}",
{% endfor -%}



{% set ns = namespace(devices=[]) %}
{%- for device_id in states | map(attribute='entity_id') | map('device_id') | unique | reject('eq', none) %}
{%- set identifiers = device_attr(device_id, 'identifiers') | list | selectattr('0', 'eq', 'zwave_js') | selectattr('1', 'search', '^([0-9]+)-([0-9]+)$') | list | first | default %}
{%- if identifiers %}
  {%- set node = identifiers[-1].split('-')[-1] | int %}
  {%- set ns.devices = ns.devices + [(node, device_entities(device_id))] %}
{%- endif %}
{%- endfor %}
{%- for node, entities in ns.devices | sort(attribute='0') %}
{{ node }}:
{%- for entity in entities %}
- {{ entity }}
{%- endfor %}
{% endfor %}



