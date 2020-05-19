import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'

const endpoint = '/api/todos'

const app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        todoList: []
    },
    async mounted() {
        this.todoList = await request(endpoint)
    },
    methods: {
        async addTodo() {
            const response = await request(endpoint, 'POST', {text: this.newTodo})
            this.todoList.push(response)
            this.newTodo = ''
        },
        async removeTodo(todo) {
            const response = await request(`${endpoint}/${todo.id}`, 'DELETE')

            const index = this.todoList.indexOf(todo)
            if(index !== -1) {
                this.todoList.splice(index, 1)
            }
        },
        async checkTodo(todo) {
            const response = await request(`${endpoint}/${todo.id}`, 'PUT', {
                ...todo,
                done: !todo.done
            })

            todo.done = response.done
        }
    },
    computed: {
        canAdd() {
            return this.newTodo.length
        }
    }
})


async function request(url, method = 'GET', data = null) {
    try {
        const headers = {}
        let body

        if(data) {
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        })

        return await response.json()
    }
    catch(e) {
        console.log("ОШИБКА: ", e)
    }
}