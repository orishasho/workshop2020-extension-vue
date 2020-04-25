<template>
    <li>
        <a href="#" @click="ExtensionDropdownLinkClick">{{ linkText }}</a>
        <div v-if="showStats">
            <DegreeStatusPage/>
        </div>
    </li>
</template>

<script>
    import DegreeStatusPage from "../DegreeStatus/DegreeStatusPage";
    export default {
        name: "ExtensionDropdownLink",
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
            ExtensionDropdownLinkClick() {
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