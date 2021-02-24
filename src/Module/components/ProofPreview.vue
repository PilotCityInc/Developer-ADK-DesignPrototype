<template>
  <div>
    <v-dialog v-model="showDialog" max-width="60%" transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn x-small outlined v-bind="attrs" v-on="on"
          ><v-icon small left>mdi-magnify</v-icon>View</v-btn
        >
      </template>

      <v-card>
        <v-card-title>
          <div class="d-flex align-end flex-column">
            <v-btn icon large color="primary" @click="showDialog = false">
              <v-icon large>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-carousel hide-delimiter-background>
          <v-carousel-item v-for="image in images" :key="image">
            <v-img :src="image" contain max-height="500" />
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/composition-api';

export default {
  name: 'ProofPreview',
  props: {
    images: {
      type: [String, Array],
      required: true
    }
  },
  setup() {
    const showDialog = ref(false);
    return {
      showDialog
    };
  }
};
</script>
