export function channels() {
    return fetch(`https://api.npoint.io/5baf2e4511d5036d3a7a`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => console.log(error));
}