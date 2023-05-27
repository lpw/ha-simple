{% for thing in states.light  -%}
"{{ thing.entity_id }}": "{{ device_id( thing.entity_id ) }}",
{% endfor -%}

{% for thing in states.switch  -%}
"{{ thing.entity_id }}": "{{ device_id( thing.entity_id ) }}",
{% endfor -%}

{% for thing in states.binary_sensor  -%}
"{{ thing.entity_id }}": "{{ device_id( thing.entity_id ) }}",
{% endfor -%}

