<template>
 <Dropdown>
    <template slot="toggler">
        <button class ="gradd-dropdown-btn">
        {{ buttonText }} &nbsp;
            <font-awesome-icon icon="angle-down" size="1x" class ="dropdown-angle-down"/>
        </button>
    </template>
    <DropdownContent>
        <DropdownItem v-for="(course, i) in userCoursesToRate" :key="i" @click="dropdownBtnClick">
            {{ course.course_name }}
        </DropdownItem>
    </DropdownContent>
    </Dropdown>
</template>

<script>
import Dropdown from "./Dropdown";
import DropdownContent from "./DropdownContent";
import DropdownItem from "./DropdownItem";

export default {
    name: "DropdownWrapper",
    components: {
    Dropdown,
    DropdownContent,
    DropdownItem
    },
    props: [
      'userCoursesToRate',
      'buttonText'
    ],
    methods: {
        dropdownBtnClick(clickedCourseName) {
            alert(clickedCourseName);
        }
    }
};
</script>

<style scoped lang="scss">
    .gradd-dropdown-btn {
        display: flex !important;
        border: none !important;
        border-radius: 0.4em !important;
        margin-top: 3%;

        .dropdown-angle-down {
            margin-top: 5% !important;
        }
    }
</style>
