<template>
    <div v-if="places && places.length > 2" class="rating-container">
        <h3> {{heading}} </h3>
        <div class="medals-container">
            <div class="first-place-container">
                <font-awesome-icon icon="medal" size="7x" class="first-place-medal"/>
                <h1>{{places[0].course_name + " " + places[0].cnt}}</h1>
            </div>

            <div class="second-place-container">
                <font-awesome-icon icon="medal" size="5x" class="second-place-medal"/>
                <h2>{{places[1].course_name + " " + places[1].cnt}}</h2>
            </div>

            <div class="third-place-container">
                <font-awesome-icon icon="medal" size="3x" class="third-place-medal"/>
                <h4>{{places[2].course_name + " " + places[2].cnt}}</h4>
            </div>
            
        </div>
    </div>
</template>

<script>
    export default {
        name: "GenericRatingPanel",
        props: ['heading', 'places'],
        methods: {
            mounted: function() {
                console.dir(places);
            }
        }
    }
</script>

<style scoped lang="scss">
    .rating-container {
        display: flex;
        flex-direction: column;
        margin-top: 5%;
        margin-right: 10%;
    }

    .medals-container {
        display: flex;
        justify-content: center;
        margin-top: 1%;
    }

    .rating-container h3{
        font-size: 25px;
        font-weight: bold;
    }

    .first-place-container {
        color: #f7cd59;
        flex-basis: 33%;
        display: flex;
        flex-direction: column;
        align-items: center;

            h1 {
                color: #f7cd59 !important;
            }
    }

    .second-place-container  {
        color: #aaa9ad;
        margin-top: 2%;
        flex-basis: 33%;
        display: flex;
        flex-direction: column;
        align-items: center;

            h2 {
                margin-top: 4%;
                color: #aaa9ad !important;
            }
    }

    .third-place-container  {
        color: #cd7f32;
        margin-top: 4%;
        flex-basis: 33%;
        display: flex;
        flex-direction: column;
        align-items: center;

            h4 {
                margin-top: 6%;
                color: #cd7f32 !important;
                font-weight: bold;
            }

    }
</style>