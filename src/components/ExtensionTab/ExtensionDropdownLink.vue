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
            componentName: String,
            componentsRendered: Array
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
                let contentContainer = document.querySelector(".container.content");
                let contentContainerId = contentContainer.getAttribute("id");
                if (contentContainerId !== 'main-content-container-id') {
                    contentContainer.setAttribute("id", 'main-content-container-id');
                }
                this.$nextTick(() => {
                    this.handleVisibilityToggling(contentContainer);
                    document.querySelector("h1.pull-right").innerText = this.linkText;
                    this.$emit('component-rendered', this.componentName);
                });
            },

            handleVisibilityToggling(contentContainer) {
                if (this.componentsRendered.length === 0) {
                    // This is the first component to be rendered
                    contentContainer.removeChild(contentContainer.children[0]);
                } else if (this.componentsRendered.length === 1) {
                    if (this.componentName !== this.componentsRendered[0]) {
                        // Rendered one component in the past, now rendering a second one
                        contentContainer.children[0].style.display = "none";
                    }
                } else if (this.componentsRendered.length === 2) {
                    if (!this.componentsRendered.includes(this.componentName)) {
                        // Rendered two components in the past, now rendering the final one
                        contentContainer.children[0].style.display = "none";
                        contentContainer.children[1].style.display = "none";
                    } else {
                        // Rendered two components in the past, now rendering one that exists
                        this.toggleCorrectComponentVisibility(this.componentName, this.componentsRendered, contentContainer);
                    }
                } else if (this.componentsRendered.length === 3) {
                    // Rendered three components in the past - now rendering one that exists
                    this.toggleCorrectComponentVisibility(this.componentName, this.componentsRendered, contentContainer);
                }
            },

            toggleCorrectComponentVisibility(componentName, componentsRendered, contentContainer) {
                const indexToToggleVisibility = componentsRendered.indexOf(componentName);
                for (let i = 0; i < contentContainer.children.length; i++) {
                    // Toggle visibility only for the current component to render
                    if (i === indexToToggleVisibility) {
                        contentContainer.children[i].style.display = "block";
                    } else {
                        contentContainer.children[i].style.display = "none";
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>