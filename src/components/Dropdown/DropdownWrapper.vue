<template>
 <Dropdown>
    <template slot="toggler">
        <button
        class="relative flex items-center focus:outline-none pl-5 pr-3 py-2 rounded-lg bg-gray-300 text-gray-800 font-semibold"
        >
        Click me
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="ml-1 h-5 w-5 fill-current text-gray-700"
        >
            <path
            d="M15.3 9.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z"
            ></path>
        </svg>
        </button>
    </template>
    <DropdownContent>
        <DropdownItem v-for="course in userCoursesToRate" :key="course.course_number">
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
  props: ['userCoursesToRate']
};
</script>
