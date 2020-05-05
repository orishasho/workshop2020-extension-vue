const { Client } = require("pg")
const express = require("express")
const app = express();
app.use(express.json())


const client = new Client({
    connectionString: 'postgres://grxpeaoqzicdni:7cfa58fb0fc0bfc11bb8f374050230dc43e9ab5646df2f8a906987d287906bf3@ec2-46-137-84-173.eu-west-1.compute.amazonaws.com:5432/desmg0q6m0n9n0',
    ssl: { rejectUnauthorized: false }
})


app.get('/', (request, response) => {
        response.json({ info: 'Node.js, Express, and Postgres API' })
    })
    //app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`))

app.get("/users_courses", async(req, res) => {
    const course_number = req.query["course_number"];
    const user_id = req.query["user_id"];
    //const reqJson = req.body;
    //const rows = await readUsersCourses(reqJson.course_number);
    const rows = await readUsersCourses(course_number, user_id);
    res.setHeader("content-type", "application/json")
    res.setHeader('Access-Control-Allow-Origin', 'https://mtamn.mta.ac.il');
    res.send(JSON.stringify(rows))
})

app.post("/users_courses", async(req, res) => {
    let result = {}
    try {
        const reqJson = req.body;
        await insertToUsersCourses(reqJson.user_id, reqJson.course_number, reqJson.course_status, reqJson.course_grade)
        result.success = true;
    } catch (e) {
        result.success = false;
    } finally {
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(result))
    }
})



/*
app.delete("/users_courses", async(req, res) => {
    let result = {}
    try {

        const reqJson = req.body;
        await deleteFromUserCourses(reqJson.id)
        result.success = true;
    } catch (e) {
        result.success = false;
    } finally {
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(result))
    }

})
*/

app.listen(8080, () => console.log("Web server is listening.. on port 8080"))

start()

async function start() {
    await connect();
    /*
        const successCreate = await insertToUsersCourses(1, '111111', 'passed', 95)
        console.log(`Creating was ${successCreate}`)
        const ucs = await readUsersCourses();
        console.log(ucs)
            //const successCreate = await insertToUsersCourses("Go to trader joes")
            //console.log(`Creating was ${successCreate}`)    
            */
}

async function connect() {
    try {
        await client.connect();
    } catch (e) {
        console.error(`Failed to connect: ${e}`)
    }
}

async function readUsersCourses(course_number, user_id) {
    try {
        const results = await client.query("select * from user_courses where course_number = $1 AND user_id = $2", [course_number, user_id]);
        return results.rows;
    } catch (e) {
        return [];
    }
}

async function insertToUsersCourses(user_id, course_number, course_status, course_grade) {
    try {
        await client.query("insert into user_courses (user_id, course_number, course_status, course_grade) values ($1, $2, $3, $4)", [user_id, course_number, course_status, course_grade]);
        return true
    } catch (e) {
        return false;
    }
}

/*
async function deleteTodo(id) {
    try {
        await client.query("delete from todos where id = $1", [id]);
        return true
    } catch (e) {
        return false;
    }
}
*/