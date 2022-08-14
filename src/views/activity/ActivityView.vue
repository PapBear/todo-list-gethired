<template>
  <div class="activity-detail__container">
    <div class="activity-detail__header">
      <div class="activity-detail__header-container">
        <div data-cy="todo-back-button" class="activity-detail__header-back" @click="backToDashboard()">
          <ChevronLeftVue></ChevronLeftVue>
        </div>
        <input data-cy="todo-title" class="activity-detail__header-text" :class="{'activity-detail__header-text_focused': inputFocused}" v-model="inputValue" v-show="inputFocused === true" @blur="setInputFocus(false)">
        <p data-cy="todo-title" class="activity-detail__header-text" @click="setInputFocus(true)" v-show="inputFocused === false">{{inputValue}}</p>
        <div data-cy="todo-title-edit-button" @click="setInputFocus(true)" class="activity-detail__header-edit">
          <EditIcon></EditIcon>
        </div>
      </div>
      <div class="activity-detail__header-button">
        <div class="activity-detail__header-button-sort" v-click-outside="() => sortPopup = false">
          <div data-cy="todo-sort-button" class="activity-detail__header-button-sort-shape" @click="setSortPopup()">
            <MenuArrow></MenuArrow>
          </div>
          <div class="activity-detail__header-button-sort-menu-container" v-if="sortPopup">
            <div :data-cy="dt === 'Terbaru' ? 'sort-latest' : dt === 'Terlama' ? 'sort-oldest' : dt === 'A-Z' ? 'sort-az' : dt === 'Z-A' ? 'sort-za' : 'sort-unfinished'"  class="activity-detail__header-button-sort-menu" v-for="(dt, index) in sortList" :key="index" @click="selectSort(dt)">
              <div class="activity-detail__header-button-sort-menu-item">
                <SortLatest v-if="dt === 'Terbaru'"></SortLatest>
                <SortOldest v-else-if="dt === 'Terlama'"></SortOldest>
                <SortAZ v-else-if="dt === 'A-Z'"></SortAZ>
                <SortZA v-else-if="dt === 'Z-A'"></SortZA>
                <SortUnfinished v-else-if="dt === 'Belum Selesai'"></SortUnfinished>
                <p class="activity-detail__header-button-sort-menu-item-text">{{dt}}</p>
                <div class="activity-detail__header-button-sort-menu-item-checklist" v-if="dt === selectedSort">
                  <ChecklistIcon></ChecklistIcon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-cy="todo-add-button" class="activity-detail__header-button-shape">
          <Plus></Plus>
          <p class="activity-detail__header-button-shape-text" @click="setVisibilityAddPopup()">Tambah</p>
        </div>
      </div>
    </div>
    <div class="dashboard__loading" v-if="initialLoading">
      <img class="dashboard__loading-img" src="../../assets/images/SpinnerTransparent.gif" />
    </div>
    <div class="activity-detail__empty-state" v-else>
      <div class="activity-detail__list-item-container" v-if="listItem?.todo_items?.length > 0">
        <div data-cy="todo-item" class="activity-detail__list-item" v-for="(dt,index) in listItem.todo_items" :key="index">
          <div class="activity-detail__list-item-content">
            <input data-cy="todo-item-checkbox" type="checkbox" class="activity-detail__list-item-content-checkbox" :class="{'activity-detail__list-item-checkbox_checked': dt.is_active === false}" v-model="dt.is_active" @click="updateActive(dt)"/>
            <div data-cy="todo-item-priority-indicator">
              <StatusView :status="dt.priority"></StatusView>
            </div>
            <p data-cy="todo-item-title" class="activity-detail__list-item-content-title" :class="{'activity-detail__list-item-content-title_done': dt.is_active === true}">{{dt.title}}</p>
            <div data-cy="todo-item-edit-button" class="activity-detail__list-item-content-edit" @click="setVisibilityAddPopup('edit', dt)">
              <EditIcon></EditIcon>
            </div>
            <div data-cy="todo-item-delete-button" class="activity-detail__list-item-content-delete" @click="setVisibilityDeletePopup(dt)">
              <DeleteButtonVue></DeleteButtonVue>
            </div>
          </div>
        </div>
      </div>
      <div data-cy="todo-empty-state" @click="setVisibilityAddPopup()" v-else>
        <ActivityEmptyStateVue :imageNumber="2"></ActivityEmptyStateVue>
      </div>
    </div>

    <!-- Modal -->
    <AddItem v-if="addPopup" @close-modal="eventModalClossed" @get-list-item="getListItem" :titlePassed="editTitle" :statusPassed="editStatus" :typeModal="typePassed" :idPassed="idPassed"></AddItem>
    <PopupView v-if="deletePopup" :type="'item'" :activityName="selectedData.title" @close-modal="eventModalClossed" @get-list-card="getListItem" :activityId="selectedData.id" ></PopupView>
  </div>
</template>

<script>
import Plus from "../../assets/images/PlusIcon.vue"
import EditIcon from "../../assets/images/EditIcon.vue";
import DeleteButtonVue from "@/assets/images/DeleteButton.vue";
import ActivityEmptyStateVue from "@/components/ActivityEmptyState.vue";
import ChevronLeftVue from "@/components/ChevronLeft.vue";
import StatusView from "@/components/StatusView.vue";

import ClickOutside from 'vue-click-outside'
import AddItem from "@/components/AddItem.vue";
import PopupView from "@/components/PopupView.vue";
import MenuArrow from "@/assets/images/MenuArrow.vue";
import SortLatest from "../../assets/images/SortLatest.vue";
import SortOldest from "../../assets/images/SortOldest.vue";
import SortAZ from "../../assets/images/SortAZ.vue";
import SortZA from "../../assets/images/SortZA.vue";
import SortUnfinished from "../../assets/images/SortUnfinished.vue";
import ChecklistIcon from "@/assets/images/ChecklistIcon.vue";

export default {
  name: 'ActivityView',
  components: {
    Plus,
    ActivityEmptyStateVue,
    ChevronLeftVue,
    EditIcon,
    DeleteButtonVue,
    StatusView,
    AddItem,
    PopupView,
    MenuArrow,
    SortLatest,
    SortOldest,
    SortAZ,
    SortZA,
    SortUnfinished,
    ChecklistIcon
},

  data() {
    return {
      listItem: [],
      originalListItem: [],
      selectedData: 0,
      deletePopup: false,
      addPopup: false,
      sortPopup: false,
      inputFocused: false,
      inputValue: "-",
      checkedList: [],
      selectedSort: "Terbaru",
      sortList: ["Terbaru", "Terlama", "A-Z", "Z-A", "Belum Selesai"],
      editTitle: "",
      editStatus: "",
      typePassed: "",
      idPassed: 0,
      initialLoading: true
    }
  },
  mounted() {
    this.getListItem()
  },
  methods: {
    getListItem() {
      this.initialLoading = true
      this.$http.get("https://todo.api.devcode.gethired.id/activity-groups/"+this.$route.params.id).then((response) => {
        this.initialLoading = false
        this.listItem = response.data
        this.originalListItem = response.data
        this.selectSort("Terbaru")
        this.listItem.todo_items.forEach(dt => {
          if(dt.is_active === 0) {
            dt.is_active = true
          } else {
            dt.is_active = false
          }
        })
        this.inputValue = this.listItem.title
      }, err => {
        console.log(err)
      })
    },
    updateTitle() {
      this.$http.patch("https://todo.api.devcode.gethired.id/activity-groups/"+this.$route.params.id, {title: this.inputValue ? this.inputValue : "-"}).then((response) => {
        this.listItem = {
          ...this.listItem,
          title: response.data.title
        }
        this.originalListItem = {
          ...this.originalListItem,
          title: response.data.title
        }
      }, err => {
        console.log(err)
      })
    },
    updateActive(data) {
      const formData = {
        is_active: data.is_active === true ? 1 : 0,
        priority: data.priority
      }
      this.$http.patch("https://todo.api.devcode.gethired.id/todo-items/"+data.id, formData).then(() => {
        //
      }, err => {
        console.log(err)
      })
    },
    createNewItem() {
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
    setVisibilityAddPopup(param = "", data) {
      if(param === "edit") {
        this.editStatus = data.priority
        this.editTitle = data.title
        this.typePassed = "edit"
        this.idPassed = data.id
      } else {
        this.editStatus = ""
        this.editTitle = ""
        this.typePassed = ""
        this.idPassed = 0
      }
      this.addPopup = !this.addPopup
    },
    eventModalClossed() {
      setTimeout(() => {
        this.deletePopup = false
        this.addPopup = false
      }, 250)
    },
    setInputFocus(param) {
      this.inputFocused = param
      const elementInput = document.getElementsByClassName("activity-detail__header-text")[0]
      setTimeout(() => {
        elementInput.focus()
      })

      if(param === false) {
        this.updateTitle()
      }
    },
    backToDashboard() {
      this.$router.push("/")
    },
    returnActive(data) {
      if(data.is_active === 0) {
        return false
      } else {
        return true
      }
    },
    setSortPopup() {
      this.sortPopup = !this.sortPopup
    },
    selectSort(data) {
      this.selectedSort = data
      this.sortPopup = false
      if(data === "Terbaru") {
        this.listItem = this.originalListItem
      } else if(data === "Terlama") {
        const originalData = JSON.parse(JSON.stringify(this.originalListItem))
        this.listItem = originalData
        this.listItem.todo_items.reverse()
      } else if(data === "A-Z") {
        this.listItem.todo_items.sort((a, b) => {
          if(a.title.toLowerCase() < b.title.toLowerCase() ) { return -1; }
          if(a.title.toLowerCase() > b.title.toLowerCase() ) { return 1; }
          return 0;
        })
      } else if(data === "Z-A") {
        this.listItem.todo_items.sort((a, b) => {
          if(a.title.toLowerCase() < b.title.toLowerCase() ) { return 1; }
          if(a.title.toLowerCase() > b.title.toLowerCase() ) { return -1; }
          return 0;
        })
      } else if(data === "Belum Selesai") {
        this.listItem.todo_items.sort((a, b) => {
          if(a.is_active < b.is_active ) { return -1; }
          if(a.is_active > b.is_active ) { return 1; }
          return 0;
        })
      }
    }
  },

  directives: {
    ClickOutside
  },
  
}

</script>
