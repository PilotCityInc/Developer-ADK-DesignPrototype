<template>
  <div class="tableview__column mt-12">
    <v-btn
      x-small
      depressed
      class="mr-1 mb-6"
      :dark="filter === 'Personal' ? true : false"
      :outlined="filter !== 'Personal' ? true : false"
      @click="filter = 'Personal'"
      >Personal</v-btn
    >
    <v-btn
      class="ml-1 mb-6"
      x-small
      depressed
      :dark="filter === 'Team' ? true : false"
      :outlined="filter !== 'Team' ? true : false"
      @click="filter = 'Team'"
      >Team</v-btn
    >
    <!-- <div class="tableview__total-log-title mt-6 b-2">Logged Time</div>
    <div class="tableview__total-log mb-6">00h 00m</div> -->
    <v-data-table
      :headers="header"
      :items="tableItems"
      sort-by="resource"
      :items-per-page="100"
      :hide-default-footer="true"
    >
      <template v-slot:item.avatar>
        <v-avatar size="30"
          ><img
            src="https://media-exp1.licdn.com/dms/image/C5603AQEq9BL9NuOBAQ/profile-displayphoto-shrink_200_200/0?e=1610582400&v=beta&t=1lSuL9hD0Fp4HGbTuAiQOTNOhOxXzqNvXVo1mg51Wmg"
        /></v-avatar>
      </template>
      <template v-slot:item.proof="{ item }">
        <ProofPreview :images="item.proof" />
      </template>
      <template v-slot:item.time="{ item }">
        <span>{{ formatDate(item.time) }}</span>
      </template>
      <template v-slot:item.delete="{ item }">
        <v-btn
          v-if="item.author.equals(userId)"
          small
          icon
          depressed
          @click="$emit('removeMilestone', item.id)"
          ><v-icon small color="red"> mdi-delete </v-icon></v-btn
        >
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import { ref, PropType, computed } from '@vue/composition-api';
import { ObjectId } from 'bson';
import ProofPreview from './ProofPreview.vue';
import TABLE_HEADER from './const';
import { TableItem } from '../types';

export default {
  name: 'TableView',
  components: {
    ProofPreview
  },
  props: {
    items: {
      required: true,
      type: Array as PropType<TableItem[]>
    },
    userId: {
      required: true,
      type: Object as PropType<ObjectId>
    }
  },
  setup(props) {
    const filter = ref('Personal');
    const tableItems = computed(() =>
      props.items.filter((item: TableItem) => {
        if (filter.value === 'Personal') return item.author.equals(props.userId);
        return true;
      })
    );
    const formatDate = (date: Date) => {
      return moment(date).fromNow();
    };
    return { header: ref(TABLE_HEADER), formatDate, filter, tableItems };
  }
};
</script>

<style lang="scss">
.tableview {
  &__column {
    text-align: center;
    // display: flex;
    flex-direction: column;
    max-width: 100% !important;
  }

  &__total-log {
    font-family: Raleway;
    font-size: 30px;
    font-weight: 800;
  }
  &__total-log-title {
    font-family: Raleway;
    font-size: 12px;
    letter-spacing: 1px;
    font-weight: 900;
    color: #000000;
    text-transform: uppercase;
  }
}
</style>
