<template>
 <Dropdown>
    <template slot="toggler">
        <button class ="gradd-dropdown-btn">
        {{ selectButtonText }} &nbsp;
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
    data: function () {
        return {
            selectButtonText: this.buttonText
        }
    },
    props: [
      'userCoursesToRate',
      'buttonText'
    ],
    methods: {
        dropdownBtnClick(clickedCourseName) {
            this.selectButtonText = clickedCourseName;
            const currentCourseToRate = this.userCoursesToRate.find(course => course.course_name === clickedCourseName).course_number;
            this.$emit('show-stars', currentCourseToRate);         
        }
    }
};
</script>

<style scoped lang="scss">
    .gradd-dropdown-btn {
        display: flex !important;
        border: none !important;
        border-radius: 0.4em !important;
        margin-top: 3% !important;

        .dropdown-angle-down {
            align-self: center !important;
        }
    }
</style>
