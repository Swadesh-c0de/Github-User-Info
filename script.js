const usernameInput = document.getElementById("username-input");
const searchButton = document.getElementById("search-btn");
const home = document.getElementById('home');

searchButton.addEventListener('click', () => searchData({ "key": "Enter", }));
usernameInput.addEventListener('keypress', (element) => searchData(element));

function searchData(e) {
    if (e.key === 'Enter') {
        if (usernameInput.value !== "") {
            fetchData();
        }
    }
}
async function fetchData() {
    const response = await fetch(`https://api.github.com/users/${usernameInput.value}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            home.removeChild(home.lastChild);
            if(data.status==404){
                alert("Profile of this username not found");
                return;
            }
            setData(data);
            console.log("Fetched Data ", data);
        })
        .catch(error => console.error("Error occers: ", error));
}

function setData(data) {
    const outputBox = document.createElement('div');
    outputBox.setAttribute('id', 'output-div');
    home.append(outputBox);

    // Profile Image
    const imgDiv = document.createElement('div');
    imgDiv.setAttribute('class', 'profile-img-div');
    // console.log(imgDiv.getAttribute('class'));
    imgDiv.style.backgroundImage = `url(${data.avatar_url})`;
    imgDiv.style.backgroundRepeat = 'no-repeat';
    imgDiv.style.backgroundPosition = 'center';
    imgDiv.style.backgroundSize = 'cover';
    outputBox.append(imgDiv);

    // name and username in a single div...
    const nameDiv = document.createElement('div');
    nameDiv.setAttribute('class', 'nameDiv');
    outputBox.append(nameDiv);

    // Name
    const name = document.createElement('h4');
    name.setAttribute('class', 'name');
    name.innerText = `Name: ${data.name}`;
    nameDiv.append(name);

    // Username
    const username = document.createElement('p');
    username.setAttribute('class', 'username');
    username.innerText = `Username: ${data.login}`;
    nameDiv.append(username);

    nameDiv.append(name);
    nameDiv.append(username);

    // Follow
    const follow = document.createElement('p');
    follow.setAttribute('class', 'follow');
    follow.innerHTML = `<span id='follow'>${data.followers}</span> Followers • <span id='follow'>${data.following}</span> Following`;

    nameDiv.append(follow);

    // Details
    const address = document.createElement('div');
    address.setAttribute('class', 'address');
    address.innerHTML = `<svg class="octicon octicon-location" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
    <path d="m12.596 11.596-3.535 3.536a1.5 1.5 0 0 1-2.122 0l-3.535-3.536a6.5 6.5 0 1 1 9.192-9.193 6.5 6.5 0 0 1 0 9.193Zm-1.06-8.132v-.001a5 5 0 1 0-7.072 7.072L8 14.07l3.536-3.534a5 5 0 0 0 0-7.072ZM8 9a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 9Z">
    </path></svg> ${data.location}`;
    nameDiv.append(address);

    // Profile
    const profile = document.createElement('a')
    profile.setAttribute('href', `${data.html_url}`);
    profile.setAttribute('id','profileA');
    profile.innerText = 'Visit Profile';

    nameDiv.append(profile);

    // Bio
    const bio = document.createElement('div');
    bio.setAttribute('class', 'bioDiv');
    bio.innerText = `${data.bio}`;
    outputBox.append(bio);

    // Public Repo
    fetchRepo(data);

    async function fetchRepo(e){
        const response = await fetch(`${e.repos_url}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(repoData => {
                setRepo(repoData);
                console.log("Repo data ", repoData);
            })
            .catch(error => console.error("Error occers while fetching user's public repo: \n", error));
    }

    function setRepo(e){   
        const ul = document.createElement('ul');
        ul.setAttribute('class','repoUList');
        ul.innerHTML = "<span class='spanRepo'>Repositories</span>";
        outputBox.append(ul);
    
        let length = e.length;
        let a = 0;
        while(a<length){
            const li = document.createElement('li');
            const i = document.createElement('a');
            i.setAttribute('href',`${e[a].html_url}`);
            i.setAttribute('id','repoList');
            i.innerText = `${e[a].name}`;
            li.append(i);
            ul.append(li);
            a = a+1;
        }
    }
}
