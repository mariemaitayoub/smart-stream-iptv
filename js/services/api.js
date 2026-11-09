export function channels() {
    return fetch(`https://smart-stream-api.free.beeceptor.com/channels`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            return data
        })
        .catch(error => console.log(error));
}