<template>
  <SidenavBox
    @toggle="$emit('toggleBox')"
    :expanded="expanded"
  >
    <template slot="icon">
      <q-icon name="fa-fw fa-shopping-cart" />
    </template>
    <dev
      slot="tools"
      class="tools"
    >
      <q-btn
        flat
        small
      >
        <q-icon name="fa-fw fa-ellipsis-v" />
        <q-tooltip v-t="'BUTTON.MORE_OPTIONS'" />
        <StoreOptions/>
      </q-btn>
    </dev>

    <q-list
      highlight
      no-border
      class="no-padding"
    >
      <q-item :to="{name: 'storePickups', params: { storeId }}">
        <q-item-side class="text-center">
          <q-icon name="fa-shopping-basket" />
        </q-item-side>
        <q-item-main>
          {{ $t("GROUP.PICKUPS") }}
        </q-item-main>
      </q-item>
      <q-item :to="{name: 'storeFeedback', params: { storeId }}">
        <q-item-side class="text-center">
          <q-icon name="fa-balance-scale" />
        </q-item-side>
        <q-item-main>
          {{ $t("PICKUP_FEEDBACK.TITLE") }}
        </q-item-main>
      </q-item>
      <q-item :to="{name: 'storeHistory', params: { storeId }}">
        <q-item-side class="text-center">
          <i class="far fa-clock"/>
        </q-item-side>
        <q-item-main>
          {{ $t("GROUP.HISTORY") }}
        </q-item-main>
      </q-item>
    </q-list>

  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem, QItemSide, QIcon, QItemMain, QTooltip } from 'quasar'
import SidenavBox from './SidenavBox'
import StoreOptions from './StoreOptions'

export default {
  props: {
    storeId: { required: true, type: Number },
    expanded: { default: true, type: Boolean },
  },
  components: {
    SidenavBox, StoreOptions, QBtn, QList, QItem, QItemSide, QIcon, QItemMain, QTooltip,
  },
}
</script>

<style scoped lang="stylus">
.tools
  .q-btn
    width 30px
    padding 0 1px
</style>
