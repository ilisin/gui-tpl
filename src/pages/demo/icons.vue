<script setup lang='ts'>
import RawMdiAlarmOff2 from '~icons/mdi/alarm-off?raw&width=1em&height=1em'
import RawMdiAlarmOff from '~icons/mdi/alarm-off?raw&width=4em&height=4em'
</script>

<template>
  <!-- raw example -->
  <pre>
    import RawMdiAlarmOff from '~icons/mdi/alarm-off?raw&width=4em&height=4em'
    {{ RawMdiAlarmOff }}
    import RawMdiAlarmOff2 from '~icons/mdi/alarm-off?raw&width=1em&height=1em'
    {{ RawMdiAlarmOff2 }}
  </pre>
  <!-- svg example -->
  <span v-html="RawMdiAlarmOff" />
  <span v-html="RawMdiAlarmOff2" />

  <!-- auto importing -->
  <i-carbon-accessibility />
  <ICarbonAccessibility />
  <IMdiAccountBox style=" color: red;font-size: 2em;" />
  <!-- mdi:application-braces -->
  <IMdiApplicationBraces style=" color: green;font-size: 2em;" />
</template>
