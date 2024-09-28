const url = "https://api.github.com/users/mua22";

let dat = async function sid() {
    try {
        let data = await fetch(url);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        let res = await data.json();
        console.log(res);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

sid();
