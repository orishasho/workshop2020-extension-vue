<template>
    <li class="dropdown">
        <a href="#" class="dropdown-toggle menu-item-has-children DDLocal" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">לשונית תוסף</a>
        <ul class="dropdown-menu">
            <ExtensionDropdownLinkClick 
            v-for="(linkText, i) in linkTexts" 
            :key="linkText" 
            :linkText="linkText"
            :componentName="compnentsNames[i]"/>
        </ul>
    </li>
</template>

<script>
    import ExtensionDropdownLinkClick from "./ExtensionDropdownLink";
    export default {
        name: "ExtensionDropdown",
        components: {
            ExtensionDropdownLinkClick
        },
        data: function () {
            return {
                linkTexts: ['ניהול תואר', 'בניית מערכת שעות', 'Gradd Together'],
                compnentsNames: ['DegreeStatusPage', 'Schedule', 'GraddTogetherContainer']
            }
        }
    }
</script>

<style scoped>

</style>