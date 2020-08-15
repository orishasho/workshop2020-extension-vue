<template>
    <li>
        <a href="#" @click="ExtensionDropdownLinkClick">{{ linkText }}</a>
        <div v-if="showComponents">
            <component :is="componentName"/>
        </div>
    </li>
</template>

<script>
    import DegreeStatusPage from "../DegreeStatus/DegreeStatusPage";
    import Schedule from "../Schedule";
    import GraddTogetherContainer from "../GraddTogether/GraddTogetherContainer";
    export default {
        name: "ExtensionDropdownLink",
        props: {
            linkText: String,
            componentName: String
        },
        components: {
            DegreeStatusPage, 
            Schedule,
            GraddTogetherContainer
        },
        data: function () {
            return {
                showComponents: false
            }
        },
        methods: {
            ExtensionDropdownLinkClick() {
                this.showComponents = true;
                let contentContainer = document.querySelectorAll(".container.content");
                contentContainer.forEach(e => {
                    console.log(e);
                    if (e.getAttribute("id") !== "content-app") {
                        if (e.getAttribute("role") === "main") {
                            e.setAttribute("id", "main-content-container-id")
                            e.innerHTML = "";
                        }
                        else {
                        e.parentNode.removeChild(e);
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>