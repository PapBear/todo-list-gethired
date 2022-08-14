<template>
  <div class="modal__popup">
    <div class="modal__popup-mask"></div>
    <div data-cy="modal-delete" class="modal__popup-content" :class="{'modal__popup-content_show': initialShow}" v-click-outside="closeModal" v-show="state === 'popup'">
      <div data-cy="modal-delete-icon" class="modal__popup-content-warning">
        <RedWarningVue></RedWarningVue>
      </div>
      <div class="modal__popup-content-text-container">
        <p data-cy="modal-delete-title" class="modal__popup-content-text">Apakah anda yakin ingin menghapus {{type === "item" ? "List Item" : "activity"}} <span class="modal__popup-content-text_bold">“{{activityName}}”</span> ?</p>
      </div>
      <div class="modal__popup-content-button-container">
        <div data-cy="modal-delete-cancel-button" class="modal__popup-content-button" @click="closeModal()">
          <p class="modal__popup-content-button-text">Batal</p>
        </div>
        <div data-cy="modal-delete-confirm-button" class="modal__popup-content-button modal__popup-content-button_delete" @click="type === 'item' ? deleteItem() : deleteActivity()">
          <p class="modal__popup-content-button-text modal__popup-content-button-text_delete">Hapus</p>
        </div>
      </div>
    </div>
    <div data-cy="modal-information" class="modal__popup-success" :class="{'modal__popup-success_show': successDeleteModal}" v-show="state === 'success-delete'">
      <div class="modal__popup-success-content">
        <div data-cy="modal-information-icon" class="modal__popup-success-content-icon">
          <InformationIcon></InformationIcon>
        </div>
        <p data-cy="modal-information-title" class="modal__popup-success-content-text">Activity berhasil dihapus</p>
      </div>
    </div>
  </div>
</template>

<script>

import RedWarningVue from '@/assets/images/RedWarning.vue';
import InformationIcon from '@/assets/images/InformationIcon.vue';
import ClickOutside from 'vue-click-outside'

export default {
  props: {
    activityName: String,
    activityId: Number,
    type: String
  },

  components: {
      RedWarningVue,
      InformationIcon
  },
  
  data() {
    return {
      initialShow: false,
      successDeleteModal: false,
      firstLoad: false,
      state: "popup"
    }
  },

  mounted() {
    setTimeout(() => {
      this.initialShow = true
      this.firstLoad = true
    },)
  },

  // do not forget this section
  directives: {
    ClickOutside
  },

  methods: {
    closeModal() {
      if(this.firstLoad) {
        this.initialShow = false
        this.successDeleteModal = false
        this.$emit("close-modal")
      }
    },
    deleteActivity() {
      this.$http.delete("https://todo.api.devcode.gethired.id/activity-groups/"+this.activityId).then(() => {
        this.initialShow = false
        setTimeout(() => {
          this.state = "success-delete"
          setTimeout(() => {
            this.successDeleteModal = true
          }, 100)
        }, 250)
        this.$emit("get-list-card")
      }, err => {
        console.log(err)
      })
    },
    deleteItem() {
      this.$http.delete("https://todo.api.devcode.gethired.id/todo-items/"+this.activityId).then(() => {
        this.initialShow = false
        this.$emit("get-list-card")
        this.closeModal()
      }, err => {
        console.log(err)
      })
    }
  }
}

</script>

<style lang="scss">
  .modal {
    &__popup {
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      &-mask {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #000;
        top: 0;
        left: 0;
        opacity: 0.5;
      }
      &-content {
        &_show {
          top: 0;
          opacity: 1;
        }
        position: relative;
        transition: top 0.20s linear, opacity 0.20s linear;
        max-width: 600px;
        top: -30px;
        opacity: 0;
        padding: 50px 85px 43px 85px;
        background-color: #FFFFFF;
        z-index: 2;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &-warning {
          padding: 10px 10px 17px 10px;
          margin-bottom: 34px;
        }
        &-text {
          &-container {
            margin-bottom: 46px;
          }
          font-weight: 500;
          font-size: 18px;
          line-height: 27px;
          color: #111111;
          text-align: center;
          &_bold {
            font-weight: 700;
          }
        }
        &-button {
          &-container {
            display: flex;
          }
          cursor: pointer;
          width: 150px;
          height: 54px;
          background: #F4F4F4;
          border-radius: 45px;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          &_delete {
            margin-right: 0px;
            margin-left: 10px;
            background-color: #ED4C5C;
          }
          &-text {
            font-weight: 600;
            font-size: 18px;
            line-height: 27px;
            color: #4A4A4A;
            &_delete {
              color: #FFFFFF;
            }
          }
        }
      }
      &-success {
        &_show {
          top: 0;
          opacity: 1;
        }
        width: 100%;
        align-items: baseline;
        max-width: 500px;
        position: relative;
        transition: all 0.20s linear;
        top: -30px;
        opacity: 0;
        padding: 17px 27px;
        background-color: #FFFFFF;
        z-index: 2;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        &-content {
          display: flex;
          &-icon {
            padding: 3px;
          }
          &-text {
            margin-left: 10px;
            font-weight: 500;
            font-size: 14px;
            line-height: 27px;
          }
        }
      }
    }
  }
</style>