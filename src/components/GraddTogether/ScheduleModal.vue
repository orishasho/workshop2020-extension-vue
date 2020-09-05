<template>
    <div>
        <transition name="gradd-modal">
            <div class="gradd-overlay" @click.self="closeModal">
                <div class="gradd-modal">
                    <ScheduleReadOnly
                    :draft_json="draft"/>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import ScheduleReadOnly from "../Schedule/ScheduleReadOnly";
    export default {
        name: "ScheduleModal",
        components: {
            ScheduleReadOnly
        },
        props: ['draft'],
        data: function() {
            return {
                isOpen: false
            };
        },
        methods: {
            closeModal() {
                this.$emit('close-modal');
            }
        }
    };
</script>

<style scoped>
    .gradd-modal {
        width: 90% !important;
        height: 90% !important;
        margin: 0px auto !important;
        padding: 20px !important;
        background-color: #fff !important;
        border-radius: 2px !important;
        box-shadow: 0 2px 8px 3px !important;
        transition: all 0.2s ease-in !important;
        font-family: Helvetica, Arial, sans-serif !important;
        display: flex;
        overflow-y: auto !important;
    }
    .fadeIn-enter {
        opacity: 0 !important;
    }

    .fadeIn-leave-active {
        opacity: 0 !important;
        transition: all 0.2s step-end !important;
    }

    .fadeIn-enter .modal,
    .fadeIn-leave-active.modal {
        transform: scale(1.1) !important;
    }

    .gradd-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        width: 100% !important;
        height: 100% !important;
        background: #00000094 !important;
        z-index: 999 !important;
        transition: opacity 0.2s ease !important;
    }
</style>