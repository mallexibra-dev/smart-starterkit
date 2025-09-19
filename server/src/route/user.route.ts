import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { UserController } from '../controller/user.controller'
import { UsersOk, BaseError } from '../schemas/user.schema'

const router = new OpenAPIHono()
const controller = new UserController()

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: { 
        description: 'List of users retrieved successfully', 
        content: { 'application/json': { schema: UsersOk } } 
      },
      500: { 
        description: 'Server Error', 
        content: { 'application/json': { schema: BaseError } } 
      },
    },
    tags: ['Users'],
    summary: 'Get all users',
  }),
  (c) => controller.getUsers(c)
)

export default router
