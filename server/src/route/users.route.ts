import { Hono } from 'hono'
import { ExampleController } from '../controller/users.controller'
import { createUserValidation, validateBody } from '../validation/users.validation'

const app = new Hono()
const exampleController = new ExampleController()

app.get('/', (c) => exampleController.getAllUsers(c))
app.get('/:id', (c) => exampleController.getUserById(c))
app.post('/', validateBody(createUserValidation), (c) => exampleController.createUser(c))
app.put('/:id', validateBody(createUserValidation), (c) => exampleController.updateUser(c))
app.delete('/:id', (c) => exampleController.deleteUser(c))

export default app
