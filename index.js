
async function add(a, b) {
    return Math.pow(a, b);
}

const func = add.toString();

async function main() {
    const response = await fetch('http://localhost:5000/compute', {method: 'POST', body: JSON.stringify({func, args: [2, 13]})});
    const data = await response.json();
    console.log(data)
}

main().catch(err => console.log(err));
