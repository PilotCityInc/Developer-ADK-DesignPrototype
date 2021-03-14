<template>
  <v-app>
    <Module
      v-model="programDocStub"
      :user-type="userTypeStub"
      :team-doc="teamDoc"
      :user-doc="userDoc"
      :student-doc="studentDoc"
      @inputTeamDoc="teamDoc = $event"
      @inputStudentDoc="studentDoc = $event"
    />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from '@vue/composition-api';
import { ObjectId } from 'bson';
import { MongoDoc } from './Module/types';
import Module from './Module/Module.vue';

export default defineComponent({
  name: 'App',
  components: {
    Module
  },
  setup() {
    const programDocStub: Ref<MongoDoc> = ref({
      data: {
        adks: []
      },
      update: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(true);
            // reject(new Error('REJECTED'));
          }, 3000);
        });
      },
      changeStream: {}
    });
    const myTeamOwner = new ObjectId(3);
    const teamDoc: Ref<MongoDoc> = ref({
      data: {
        name: 'Team Cool',
        _id: new ObjectId(1),
        owner: myTeamOwner,
        password: '123',
        members: [
          {
            _id: new ObjectId(1),
            firstName: 'Team member 1',
            lastName: 'awesome'
          },
          {
            _id: myTeamOwner,
            firstName: 'kanye',
            lastName: 'east'
          },
          {
            _id: new ObjectId(4),
            firstName: 'travis',
            lastName: 'scott'
          }
        ],
        adks: [
          {
            name: 'make',
            logs: [
              {
                id: new ObjectId(1),
                author: new ObjectId(2),
                log: 'this is a team log',
                time: new Date(),
                proof: [
                  {
                    name: 'file2',
                    url:
                      'https://i.picsum.photos/id/56/800/600.jpg?hmac=FyoyxQ0fYaFrRoOBWRZdezHzk6sRAz-6rUWEhLJJPi4'
                  },
                  {
                    name: 'file1',
                    url:
                      'https://i.picsum.photos/id/695/800/600.jpg?hmac=TL1K4j89C4vOeDFLlzW0-BaQ2RQMMPW_4W3bW62nChM'
                  },
                  {
                    name: 'file3',
                    url:
                      'https://i.picsum.photos/id/88/800/600.jpg?hmac=pq_NN0ufELA-i1KBoWVClHR8PgrP33qly7AngNm0VJ0'
                  }
                ]
              }
            ]
          }
        ]
      },
      update: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(true);
            // reject(new Error('REJECTED'));
          }, 3000);
        });
      },
      changeStream: {}
    });

    const studentDoc: Ref<MongoDoc> = ref({
      data: {
        firstName: 'me',
        lastName: 'test',
        _id: new ObjectId(1),
        team: null as null | ObjectId,
        adks: []
      },
      update: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(true);
            // reject(new Error('REJECTED'));
          }, 3000);
        });
      },
      changeStream: {}
    });
    const userDoc: Ref<MongoDoc> = ref({
      data: {
        firstName: 'me',
        lastName: 'test',
        _id: new ObjectId(2)
      },
      changeStream: {}
    });
    const userTypeStub = 'organizer';

    return {
      programDocStub,
      studentDoc,
      userDoc,
      teamDoc,
      userTypeStub
    };
  }
});
</script>
