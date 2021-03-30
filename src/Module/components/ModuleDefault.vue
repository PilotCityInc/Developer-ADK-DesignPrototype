<template>
  <v-container class="module-default pa-0">
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
      class="mt-3"
      color="#dedede"
      height="2"
      value="100"
      buffer-value="100"
      stream
    />
    <div class="module-default__container mt-12">
      <div class="module-default__log-text">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          style="display: none"
          :disabled="userType === 'stakeholder'"
          @change="onFilesAdded"
        />
        <v-text-field
          v-model="logInput"
          :disabled="userType === 'stakeholder'"
          class="module-default__text-field"
          placeholder="Describe your milestone and upload proof"
          outlined
          rounded
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
          rounded
          depressed
          :ripple="false"
          :disabled="userType === 'stakeholder'"
          @click="logMilestone"
          >LOG MILESTONE</v-btn
        >
      </div>
      <div class="module-default__log-chips">
        <v-chip
          v-for="image in images"
          :key="image.name"
          class="ma-1"
          color="green"
          dark
          close
          @click:close="removeFile(image.name)"
        >
          {{ image.name }}
        </v-chip>
      </div>

      <Table
        class="module-default__table-view"
        :items="teamAdkData ? teamAdkData.logs : []"
        :user-id="userId"
        :user-type="userType"
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
import { ref, reactive, toRefs, PropType, defineComponent } from '@vue/composition-api';
import { getModMongoDoc, getModAdk } from 'pcv4lib/src';
import { ObjectId } from 'bson';
import { MongoDoc, TableItem, Image } from '../types';
import Instruct from './ModuleInstruct.vue';
import Table from './TableView.vue';

export default defineComponent({
  name: 'ModuleDefault',
  components: {
    Instruct,
    Table
  },
  props: {
    value: {
      required: true,
      type: Object as PropType<MongoDoc>
    },
    userType: {
      required: true,
      type: String
      // participant: '',
      // organizer: '',
      // stakeholder: ''
    },
    teamDoc: {
      required: false,
      type: Object as PropType<MongoDoc>,
      default: () => {}
    },
    studentDoc: {
      required: false,
      type: Object as PropType<MongoDoc>,
      default: () => {}
    },
    userDoc: {
      required: false,
      type: Object as PropType<MongoDoc>,
      default: () => {}
    }
  },
  setup(props, ctx) {
    const fileInput = ref(null);
    const showInstructions = ref(true);
    const setupInstructions = ref({
      description: '',
      instructions: ['', '', '']
    });

    const state = reactive({
      logInput: '',
      logError: '',
      images: [] as Image[],
      programDoc: null as null | MongoDoc,
      teamDocument: null as null | MongoDoc,
      studentDocument: null as null | MongoDoc,
      userId: null as null | ObjectId,
      teamAdkData: null as null | Record<string, any>,
      studentAdkData: null as null | Record<string, any>
    });

    state.programDoc = getModMongoDoc(props, ctx.emit);
    if (props.teamDoc) {
      state.teamDocument = getModMongoDoc(props, ctx.emit, {}, 'teamDoc', 'inputTeamDoc');
      const { adkData } = getModAdk(props, ctx.emit, 'make', {}, 'teamDoc', 'inputTeamDoc');
      state.teamAdkData = adkData.value;
    }
    if (props.studentDoc) {
      state.studentDocument = getModMongoDoc(props, ctx.emit, {}, 'studentDoc', 'inputStudentDoc');
      const { adkData } = getModAdk(props, ctx.emit, 'make', {}, 'studentDoc', 'inputStudentDoc');
      state.studentAdkData = adkData.value;
    }

    state.userId = props.userDoc?.data._id;

    // Used for storing completeness of this module for the individual student.
    // Might be best to store in teamDoc, but we currently only check student's individual program for completeness
    let index = state.programDoc?.data.adks.findIndex(function findResearchObj(obj) {
      return obj.name === 'make';
    });
    if (index === -1)
      index =
        state.programDoc?.data.adks.push({
          name: 'make'
        }) - 1;

    const onFilesAdded = (event: Event) => {
      event.target!.files.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (fileEvent: Event) => {
          state.images.push({
            name: file.name,
            url: fileEvent.target!.result
          });
        };
        reader.readAsDataURL(file);
      });
    };

    const logMilestone = () => {
      if (!state.images.length && !state.logInput.length) {
        state.logError = 'Describe and attach an image of your milestone';
        return;
      }
      if (!state.images.length) {
        state.logError = 'Attach milestone screenshot, image or photo';
        return;
      }
      if (!state.logInput.length) {
        state.logError = 'Describe your milestone';
        return;
      }

      const log = {
        id: new ObjectId(),
        log: state.logInput,
        time: new Date(),
        author: props.userDoc?.data._id,
        avatar: props.userDoc?.data.profile ? props.userDoc?.data.profile.small : '',
        proof: state.images
      };

      state.teamAdkData!.logs.unshift(log);
      state.teamDocument?.update();

      state.images = [];
      state.logInput = '';
      state.logError = '';

      // TODO: get the actual expected minimum log length.
      if (state.teamAdkData?.logs.length > 3) {
        state.teamDocument?.update(() => ({
          isComplete: true,
          adkIndex: index
        }));
      }
    };

    const removeMilestone = (id: ObjectId) => {
      state.teamAdkData!.logs = state.teamAdkData!.logs.filter((item: TableItem) => {
        return item.id !== id;
      });
      state.teamDocument!.update();
    };

    const removeFile = (file: string) => {
      state.images = state.images.filter((image: Image) => image.name !== file);
    };

    return {
      ...toRefs(state),
      fileInput,
      onFilesAdded,
      logMilestone,
      removeMilestone,
      removeFile,
      setupInstructions,
      showInstructions
    };
  }
});
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
      // min-height: 57px;
    }
    margin-left: 20px;
    // height: 100%;
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
    // margin-bottom: 75px;
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
