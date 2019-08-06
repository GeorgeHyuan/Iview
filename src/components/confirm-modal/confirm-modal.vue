<style lang="less">
  @import "./style/confirm-modal.less";
</style>
<template>
  <Modal class="ConfirmModal" class-name="vertical-center-modal" v-model="modalFlag" :width="modalWidth" :mask-closable="modalMask" @on-cancel="shutModal">
    <div slot="header" class="ConfirmModal-title" style="text-align: center">
      <p class="ConfirmModal-title-icon" style="margin-bottom: 10px"><Icon type="md-alert" color="#ff6b4e" size="36" /></p>
      <p class="ConfirmModal-title-word" style="font-size: 24px">{{ modalTitle }}</p>
    </div>
    <p class="ConfirmModal-content" v-if="modalText !== null && modalText !== ''">{{ modalText }}</p>
    <slot v-else></slot>
    <div slot="footer" class="setModal-footer">
      <Button type="primary" :loading="modalSubmitLoading" @click="submitModal">{{ submitWord }}</Button>
      <Button type="default" @click="shutModal">{{ cancelWord }}</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    modalValue: {
      type: Boolean,
      default: false
    },
    modalTitle: String,
    modalWidth: {
      type: Number,
      default: 400
    },
    modalMask: {
      type: Boolean,
      default: false
    },
    modalText: {
      type: String,
      default: null
    },
    modalLoading: {
      type: Boolean,
      default: false
    },
    cancelWord: {
      type: String,
      default: '取消'
    },
    submitWord: {
      type: String,
      default: '确认'
    }
  },
  data () {
    return {
      modalFlag: false,
      modalSubmitLoading: false
    };
  },
  methods: {
    submitModal () {
      this.$emit('on-submit-modal');
    },
    shutModal () {
      this.$emit('on-cancel-modal');
    }
  },
  mounted () {
    this.$data.modalFlag = this.$props.modalValue;
    this.$data.modalSubmitLoading = this.$props.modalLoading;
  },
  watch: {
    modalValue (newValue) {
      this.$data.modalFlag = newValue;
    },
    modalLoading (newValue) {
      this.$data.modalSubmitLoading = newValue;
    }
  }
};
</script>
