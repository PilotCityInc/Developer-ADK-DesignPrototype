<template>
  <v-container class="module-default__container">
    <div class="module-default__instructions">
      <v-expansion-panels v-model="showInstructions" class="module-default__instructions" flat>
        <v-expansion-panel>
          <v-expansion-panel-header
            v-show="showInstructions"
            hide-actions
            class="pa-0"
            @click="showInstructions = true"
          >
            <template v-slot="{ open }">
              <v-scroll-y-transition hide-on-leave>
                <div v-if="!open" class="d-flex flex-column justify-center">
                  <v-icon color="grey lighten-2" class="d-flex justify-center">
                    mdi-chevron-down
                  </v-icon>
                  <div color="grey lighten-2" class="module-default__collapse-title">
                    INSTRUCTIONS
                  </div>
                </div>
              </v-scroll-y-transition>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <Instruct readonly />
            <div @click="showInstructions = true">
              <div class="module-default__collapse-title">CLOSE</div>
              <!-- <div class="hr"/> OPTIONAL -->
              <v-icon color="grey lighten-2" class="d-flex justify-center"> mdi-chevron-up </v-icon>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <v-progress-linear
      class="module-default__collapse-divider"
      color="#dedede"
      height="2"
      value="100"
      buffer-value="100"
      stream
    />
    <div class="module-edit__container-preview">
      <div class="module-default__log-text">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          style="display: none"
          @change="onFilesAdded"
        />
        <v-text-field
          v-model="logInput"
          class="module-default__text-field"
          placeholder="Describe your milestone and upload proof"
          outlined
          hide-details="auto"
          :error-messages="logError"
          append-icon="mdi-attachment"
          label="Log your milestones"
          @click:append="$refs.fileInput.click()"
        >
        </v-text-field>

        <v-btn
          class="module-default__log-btn"
          outlined
          depressed
          :ripple="false"
          @click="logMilestone"
          >LOG MILESTONE</v-btn
        >
      </div>
      <div class="module-default__log-chips">
        <v-chip
          v-for="filename in filenames"
          :key="filename"
          class="ma-1"
          color="green"
          dark
          label
          close
          @click:close="removeFile(filename)"
        >
          {{ filename }}
        </v-chip>
      </div>

      <Table
        class="module-default__table-view"
        :items="tableItems"
        :user-id="userId"
        v-on="$listeners"
        @removeMilestone="removeMilestone"
      />
      <!-- ENTER CONTENT HERE -->
      <!-- DESIGN YOUR ACTIVITY HERE / COMMENT OUT WHEN YOU'VE STARTED DESIGNING -->
      <!-- <div class="module-default__none">Design your activity here</div> -->
    </div>
  </v-container>
</template>

<script lang="ts">
import { ref, reactive, toRefs, computed } from '@vue/composition-api';
import Instruct from './ModuleInstruct.vue';
import Table from './TableView.vue';
import { TableItem } from '../types';

export default {
  name: 'ModuleDefault',
  components: {
    Instruct,
    Table
  },
  setup() {
    const fileInput = ref(null);
    const showInstructions = ref(true);
    const setupInstructions = ref({
      description: '',
      instructions: ['', '', '']
    });

    const state = reactive({
      logInput: '',
      logError: '',
      filenames: [] as string[],
      imageUrls: [] as string[],
      tableItems: [
        {
          id: 1,
          author: 2,
          log: 'this is a team log',
          time: new Date(),
          proof: [
            'https://i.picsum.photos/id/56/800/600.jpg?hmac=FyoyxQ0fYaFrRoOBWRZdezHzk6sRAz-6rUWEhLJJPi4',
            'https://i.picsum.photos/id/695/800/600.jpg?hmac=TL1K4j89C4vOeDFLlzW0-BaQ2RQMMPW_4W3bW62nChM',
            'https://i.picsum.photos/id/88/800/600.jpg?hmac=pq_NN0ufELA-i1KBoWVClHR8PgrP33qly7AngNm0VJ0'
          ]
        }
      ] as TableItem[]
    });

    const onFilesAdded = (event: Event) => {
      event.target.files.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (fileEvent: Event) => {
          // !dummy image src url creator for demo purpose. replace with backend functions
          state.imageUrls.push(fileEvent.target.result);
        };
        state.filenames.push(file.name);
        reader.readAsDataURL(file);
      });
    };

    const logMilestone = () => {
      if (!state.filenames.length && !state.logInput.length) {
        state.logError = 'Describe and attach an image of your milestone';
        return;
      }
      if (!state.filenames.length) {
        state.logError = 'Attach milestone screenshot, image or photo';
        return;
      }
      if (!state.logInput.length) {
        state.logError = 'Describe your milestone';
        return;
      }

      state.tableItems.unshift({
        id: Math.floor(Math.random() * 100),
        log: state.logInput,
        time: new Date(),
        author: 1, // !dummy user id for now
        proof: state.imageUrls
      });

      state.imageUrls = [];
      state.logInput = '';
      state.filenames = [];
      state.logError = '';
    };

    const removeMilestone = (id: number) => {
      state.tableItems = state.tableItems.filter(item => {
        return item.id !== id;
      });
    };

    const removeFile = (file: string) => {
      const index = state.filenames.indexOf(file);
      if (index > -1) {
        state.filenames.splice(index, 1);
        state.imageUrls.splice(index, 1);
      }
    };

    return {
      ...toRefs(state),
      fileInput,
      onFilesAdded,
      logMilestone,
      removeMilestone,
      removeFile,
      setupInstructions,
      showInstructions,
      userId: 1
    };
  }
};
</script>

<style lang="scss">
.module-default {
  &__log-text {
    display: flex;
    max-width: 85%;
    margin-left: auto;
    margin-right: auto;
  }

  &__log-chips {
    max-width: 85%;
    margin-left: auto;
    margin-right: auto;
  }

  &__text-field {
    &.v-text-field {
      width: 400px;
    }
  }

  &__log-btn {
    &.v-btn:not(.v-btn--round).v-size--default {
      min-height: 57px;
    }
    margin-left: 20px;
    height: 100%;
  }

  &__table-view {
    width: 100%;
    // padding-left: 10px;
    // padding-right: 10px;
    margin-bottom: 20px;
  }
  &__none {
    border-radius: 5px;
    // border: 1px solid #dedede;
    height: 100px;
    text-align: center;
    background-color: #dedede;
    font-weight: 700;
    color: #ffffff;
    font-size: 18px;
    padding-top: 35px;
  }

  &__collapse-divider {
    margin-top: 15px;
    margin-bottom: 75px;
    margin-right: none;
    margin-left: none;
    padding-right: none;
    padding-left: none;
    width: 100%;
  }

  &__collapse-title {
    color: #dedede;
    text-align: center;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 1px;
    font-size: 13px;
    //  text-uppercase font-weight-bold text-subtitle-2 text-center
  }

  &__container {
    width: 100%;
    // padding: none;
    // margin: none;
    margin-top: 0px;
    padding: 0px;
  }
  &__employer-title {
    font-size: 25px;
    font-weight: 700;
  }

  &__scope {
    font-size: 22px;
    font-weight: 800;
    text-align: center;
    max-width: 95%;
    margin: auto;
  }
  &__youtube {
    height: 400px;
    width: 95%;
    border-radius: 25px;
    // margin: 0px;
    background-color: #dedede;

    // text-align: center;
    // justify-content: center;
    // align-items: center;
    // padding-top: auto;
    // padding-bottom: auto;
  }
  &__about {
    font-size: 15px;
    font-weight: 700;
    text-align: center;
    max-width: 90%;
    margin: auto;
    line-height: 30px;
  }

  &__faq {
    font-size: 15px;
    font-weight: 700;
    text-align: center;
    max-width: 90%;
    margin: auto;
    line-height: 30px;
  }

  &__faq-chat {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-bottom: 5%;
  }
  &__faq-chat-line {
    margin: 5px;
  }

  &__faq-avatar {
    margin: 5px;
  }

  &__faq-question {
    // text-align: left;
    font-family: 'Raleway';
    font-size: 16px;
    font-weight: 800;
    color: #404142;
  }

  &__faq-answer {
    text-align: left;
    font-family: 'Raleway';
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0px;
    color: white;
    font-style: italic;
  }

  &__faq-answer-dark {
    text-align: left;
    font-family: 'Raleway';
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0px;
    color: #404142;
    font-style: italic;
  }

  &__faq-answer-dark-highlight {
    text-align: left;
    font-family: 'Raleway';
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0px;
    color: #404142;
  }

  &__specs-title {
    font-weight: 800;
  }
}
</style>
