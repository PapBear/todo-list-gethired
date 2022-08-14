<template>
  <div class="dashboard__container">
    <div class="dashboard__header">
      <p data-cy="activity-title" class="dashboard__header-text">Activity</p>
      <div class="dashboard__header-button">
        <div data-cy="activity-add-button" class="dashboard__header-button-shape">
          <Plus></Plus>
          <p class="dashboard__header-button-shape-text" @click="createNewActivity()">Tambah</p>
        </div>
      </div>
    </div>
    <div class="dashboard__loading" v-if="initialLoading">
      <img class="dashboard__loading-img" src="../../assets/images/SpinnerTransparent.gif" />
    </div>
    <div class="dashboard__empty-state" v-else>
      <div class="dashboard__list-card-container" v-if="listActivity.length > 0">
        <div dt-cy="activity-item" class="dashboard__list-card" v-for="(dt,index) in listActivity" :key="index">
          <p dt-cy="activity-item-title" class="dashboard__list-card-text" @click="moveToDetail(dt.id)">{{dt.title}}</p>
          <div class="dashboard__list-card-bottom-section">
            <div class="dashboard__list-card-bottom-section-wrapper">
              <p dt-cy="activity-item-date" class="dashboard__list-card-bottom-section-date">{{dt.created_at | moment("D MMMM YYYY")}}</p>
              <div dt-cy="activity-item-delete-button" class="dashboard__list-card-bottom-section-button" @click="setVisibilityDeletePopup(dt)">
                <DeleteButton></DeleteButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div @click="createNewActivity()" v-else>
        <ActivityEmptyStateVue :imageNumber="1"></ActivityEmptyStateVue>
      </div>
    </div>
    <!-- Modal -->
    <PopupView v-if="deletePopup" :activityName="selectedData.title" @close-modal="eventModalClossed" @get-list-card="getListCardData" :activityId="selectedData.id"></PopupView>
  </div>
</template>

<script>
import Plus from "../../assets/images/PlusIcon.vue"
// import SpinnerLoading from "../../assets/images/SpinnerLoading.gif"
import DeleteButton from "../../assets/images/DeleteButton.vue";
import ActivityEmptyStateVue from "@/components/ActivityEmptyState.vue";
import PopupView from "@/components/PopupView.vue";

export default {
  name: 'DashboardView',
  components: {
    Plus,
    ActivityEmptyStateVue,
    DeleteButton,
    PopupView
  },
  data() {
    return {
      listActivity: [],
      selectedId: 0,
      deletePopup: false,
      initialLoading: true
    }
  },
  mounted() {
    this.getListCardData()
  },
  methods: {
    getListCardData() {
      // const encodeEmail = encodeURIComponent("joshuahendrawan03@gmail.com")
      this.initialLoading = true
      this.$http.get("https://todo.api.devcode.gethired.id/activity-groups", {params: {email: "joshuahendrawan03@gmail.com"}}).then((response) => {
        this.listActivity = response.data.data
        this.initialLoading = false
      }, err => {
        console.log(err)
      })
    },
    createNewActivity() {
      const formData = {
        "title": "New Activity",
        "email": "joshuahendrawan03@gmail.com",
      }
      this.$http.post("https://todo.api.devcode.gethired.id/activity-groups", formData).then(() => {
        this.getListCardData()
      }, err => {
        console.log(err)
      })
    },
    setVisibilityDeletePopup(dt) {
      this.deletePopup = !this.deletePopup
      this.selectedData = dt
    },
    eventModalClossed() {
      setTimeout(() => {
        this.deletePopup = false
      }, 250)
    },
    moveToDetail(id) {
      this.$router.push("/activity/"+id)
    }
  }
}

</script>
