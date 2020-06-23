<template>
    <li class="dropdown extension-dropdown">
        <a href="#" class="dropdown-toggle menu-item-has-children DDLocal" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">לשונית תוסף</a>
        <ul class="dropdown-menu">
            <ExtensionDropdownLinkClick :linkText="linkText"/>
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
                linkText: 'ניהול תואר'
            }
        }
    }
</script>

<style scoped lang="scss">
    .extension-dropdown {
        background: repeating-linear-gradient(
                        45deg,
                        #FFFFFF,
                        #FFFFFF 10px,
                        #ffcb3b 10px,
                        #ffcb3b 20px
        );
        border-radius: 25px !important;
    }
</style>