<template>
<div class="gradd-user-card" @click="userCardClick">
  <div class="gradd-user-card-image-container gradd-tooltip">
    <img :src="img"
         alt="Avatar"
         :class="[this.final_draft ? this.imgClickClass : this.imgNoClickClass]">
    <span class="gradd-tooltiptext" v-if="!this.final_draft">
      {{ `${this.name} עוד לא בחר מערכת שעות לשתף` }}
    </span>
    <span class="gradd-tooltiptext" v-else>לחץ כדי להציג מערכת שעות</span>
  </div>
  <div class="gradd-user-card-name">
    {{ name }}
  </div>
  <div class="gradd-user-card-email">
    {{ user_email }}
  </div>
</div>
</template>

<script>
    export default {
        name: "UserCard",
        data: function() {
          return {
            imgClickClass: 'gradd-user-card-image-container-profile-img',
            imgNoClickClass: 'gradd-user-card-image-container-profile-img-noclick'
          }
        },
        props: ['name', 'user_email', 'img', 'final_draft'],
        methods: {
          userCardClick() {
            this.$emit('user-card-click', this.final_draft);
          }
        }
    }
</script>

<style scoped lang="scss">

  .gradd-user-card {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    margin-bottom: 30px !important;
    margin-left: 20px !important;
    flex-basis: 15% !important;

    &-name {
      margin-top: 5px !important;
      font-weight: bold !important;
    }

    &-image-container {
      &-profile-img {
        border-radius: 50% !important;
        opacity: 1 !important;
        box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.5) !important;
        border: 2px solid rgba(255, 255, 255, 0.5) !important;
        width: 100px !important;
        height: 100px !important;

        &:hover {
          box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2) !important;
          transform: scale(1.03) !important;
          transition: 0.3s !important;
          cursor: pointer !important;
        }
      }
    }

    .gradd-tooltip {
      position: relative !important;
      display: inline-block !important;

      .gradd-tooltiptext {
        visibility: hidden !important;
        width: 150px !important;
        background-color: lightgray !important;
        text-align: center !important;
        border-radius: 6px !important;
        padding: 5px 0 !important;
        position: absolute !important;
        z-index: 1 !important;
        bottom: 110% !important;
        left: 35% !important;
        margin-left: -60px !important;
        opacity: 0.95 !important;

        &::after {
          content: "" !important;
          position: absolute !important;
          top: 100% !important;
          left: 50% !important;
          margin-left: -5px !important;
          border-width: 5px !important;
          border-style: solid !important;
          border-color: lightgray transparent transparent transparent !important;
          opacity: 0.95 !important;
        }
      }

      &:hover {
        .gradd-tooltiptext {
          visibility: visible !important;
        }
      }
    }
  }

  .gradd-user-card-image-container-profile-img-noclick {
    border-radius: 50% !important;
    opacity: 1 !important;
    box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.5) !important;
    border: 2px solid rgba(255, 255, 255, 0.5) !important;
    width: 100px !important;
    height: 100px !important;

    &:hover {
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2) !important;
      transform: scale(1.03) !important;
      transition: 0.3s !important;
      cursor: not-allowed !important;
    }
  }

</style>