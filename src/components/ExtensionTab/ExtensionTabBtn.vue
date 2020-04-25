<template>
    <li>
        <a href="#" @click="ExtensionBtnClick">{{ linkText }}</a>
        <div v-if="showStats">
            <DegreeStatusPage/>
        </div>
    </li>
</template>

<script>
    import DegreeStatusPage from "../DegreeStatus/DegreeStatusPage";
    export default {
        name: "ExtensionTabBtn",
        props: {
            linkText: String
        },
        components: {
            DegreeStatusPage
        },
        data: function () {
            return {
                showStats: false
            }
        },
        methods: {
            ExtensionBtnClick() {
                this.showStats = true;
                let contentContainer = document.querySelectorAll(".container.content");
                contentContainer.forEach(e => {
                    if (e.getAttribute("id") !== "vue-content-container") {
                        e.parentNode.removeChild(e);
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>