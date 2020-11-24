<template>
  <div class="tableview__column mt-12">
    <v-btn x-small outlined depressed class="mr-1 mb-6">Personal</v-btn>
    <v-btn class="ml-1 mb-6" x-small outlined depressed>Team</v-btn>
    <!-- <div class="tableview__total-log-title mt-6 b-2">Logged Time</div>
    <div class="tableview__total-log mb-6">00h 00m</div> -->
    <v-data-table
      :headers="header"
      :items="items"
      sort-by="resource"
      items-per-page="100"
      hide-default-footer="true"
    >
      <template v-slot:item.delete>
        <v-btn small icon depressed><v-icon small color="red"> mdi-delete </v-icon></v-btn>
      </template>
      <template v-slot:item.avatar>
        <v-avatar size="30"
          ><img
            src="https://media-exp1.licdn.com/dms/image/C5603AQEq9BL9NuOBAQ/profile-displayphoto-shrink_200_200/0?e=1610582400&v=beta&t=1lSuL9hD0Fp4HGbTuAiQOTNOhOxXzqNvXVo1mg51Wmg"
        /></v-avatar>
      </template>
      <template v-slot:item.proof>
        <v-btn x-small outlined><v-icon small left>mdi-magnify</v-icon>View</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/composition-api';
import { items, HEADER } from './const';

export default {
  name: 'TableView',
  setup() {
    return { header: ref(HEADER), items };
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
