import { app } from "./app.js"
import { env } from "./config.js"

app.listen(env.PORT, () => {
  console.log(
    `API de SIG-Tecnomundo disponible en http://localhost:${env.PORT}/api`,
  )
})
