import { bench } from 'vitest'

bench('Dummy User API benchmark', async () => {
    await fetch('https://fakerestapi.azurewebsites.net/api/v1/Users')
})


bench('Dummy Author API benchmark', async () => {
    await fetch('https://fakerestapi.azurewebsites.net/api/v1/Authors')
})

bench('Dummy Book API benchmark', async () => {
    await fetch('https://fakerestapi.azurewebsites.net/api/v1/Books')
})
