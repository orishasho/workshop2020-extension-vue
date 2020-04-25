<template>
    <li class="dropdown">
        <a href="#" class="dropdown-toggle menu-item-has-children DDLocal" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">לשונית תוסף</a>
        <ul class="dropdown-menu">
            <ExtensionTabBtn :linkText="linkText"/>
        </ul>
    </li>
</template>

<script>
    import ExtensionTabBtn from "./ExtensionTabBtn";
    export default {
        name: "ExtensionTabContainer",
        components: {
            ExtensionTabBtn
        },
        data: function () {
            return {
                linkText: 'ניהול תואר'
            }
        }
    }
</script>

<style scoped>

</style>