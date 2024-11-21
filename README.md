# OverGrid
## Fully customizable, feature rich grid/datatable component for Vue3 projects.

[Demo and Docs](https://overgrid.overcode.hu)
[TypeDoc](https://overgrid.overcode.hu/typedoc/index.html)

### Getting started

```
npm i @overcodehungary/overgrid
```

### Basic Usage
```
<template>
  <OverGrid :config="config"></OverGrid>
</template>

<script setup lang="ts">
import { OverGrid, OverGridConfig } from '@overcodehungary/overgrid';
import '@overcodehungary/overgrid/dist/style.css' // default theme
import './theme.css' // custom theme

const config: OverGridConfig = {
  ... // your config here
};
</ script>
```

Check the Docs for more info.

License: MIT