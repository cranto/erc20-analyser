import axios from 'axios'

export const request = (api: string, path: string) => {
    async () => {
        try {
            let response = await axios(api + path)
            console.log(response)
        } catch(error) {
            console.log(error)
        }
    }
}