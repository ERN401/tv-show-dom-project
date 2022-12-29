const fetchAPI = async () => {
  try {
    // const res = await fetch("data.json");
    const res = await fetch("https://api.tvmaze.com/shows/82/episodes");
    /*     
     freinds: 431
     dark: 17861
     the office: 526
    */
    const data = await res.json();
    main(data);
    // console.log(data);
  } catch (err) {
    alert("something went wrong\n" + err);
  }
};
fetchAPI();

function main(data) {
  show(data);
  selectSeasonEpisode(data);
  search(data);
}

function show(data) {
  const showEpisodes = document.querySelector("#showEpisodes");
  showEpisodes.innerHTML = "";

  for (let episode of data) {
    const div = document.createElement("div");
    const img = document.createElement("img");
    const number = document.createElement("p");
    const rate = document.createElement("span");
    const runtime = document.createElement("span");
    const title = document.createElement("h3");
    const link = document.createElement("a");
    const summary = document.createElement("p");

    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.backgroundColor = "#F6F6F5";
    div.style.margin = "10px";
    div.style.padding = "20px";
    div.style.width = "250px";
    div.style.height = "300px";

    img.alt = episode.name;
    if (episode.image) {
      img.src = episode.image.medium;
    }

    //number of season and episode
    const seasonNumber = Number(episode.season).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
    });
    const episodeNumber = Number(episode.number).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
    });
    const numberOfSeasonAndEpisode = `S${seasonNumber}E${episodeNumber}`;
    number.style.display = "flex";
    number.style.justifyContent = "space-between";
    number.style.padding = "2px";
    number.style.margin = "0";
    number.style.backgroundColor = "#6B7A83";
    number.style.color = "white";

    //rate style
    rate.innerText = `${episode.rating.average}`;
    rate.style.backgroundColor = "#e2b616";
    rate.style.color = "#121212";
    rate.style.padding = "0px 2px";
    rate.style.borderRadius = "2px";
    rate.style.fontWeight = "bold";

    // runtime of the episode
    runtime.innerText = `${episode.runtime}'`;

    // title of the episode
    title.innerText = episode.name;
    title.style.whiteSpace = "nowrap";
    title.style.overflow = "hidden";
    title.style.textOverflow = "ellipsis";
    link.href = episode.url;
    link.target = "_blank";
    link.style.textDecoration = "none";
    link.style.color = "black";
    link.addEventListener("mouseover", () => {
      title.title = episode.name;
      title.style.backgroundColor = "#e2b616";
      title.style.padding = "2px";
      title.style.borderRadius = "5px";
    });
    link.addEventListener("mouseout", () => {
      title.style.backgroundColor = "#F6F6F5";
      title.style.padding = "0px";
    });

    const summayText = PtagToString(episode.summary);
    summary.innerText =
      summayText.length > 180
        ? summayText.split(" ", 25).join(" ") + "..."
        : summayText;
    summary.style.margin = "0";

    number.append(rate, numberOfSeasonAndEpisode, runtime);
    link.append(title);
    div.append(img, number, link, summary);
    showEpisodes.append(div);
  }
}

// summary of epidoses have extra things. this function remove all them
function PtagToString(p) {
  if (!p) return "";
  p = p.replaceAll("<p>", "");
  p = p.replaceAll("</p>", "");
  p = p.replaceAll("<br>", "");
  p = p.replaceAll("</br>", "");
  p = p.replaceAll("<br />", "");
  return p;
}

function selectSeasonEpisode(data) {
  const seasons = document.querySelector("#season");
  const episodesSelect = document.querySelector("#episode");

  //create options for seasons
  let numberOfSeasons = data[data.length - 1].season;
  for (let i = 1; i <= numberOfSeasons; i++) {
    const opt = document.createElement("option");
    opt.innerText = i;
    opt.value = i;
    seasons.appendChild(opt);
  }

  let season, episode, episodes, filteredData;
  seasons.addEventListener("change", () => {
    season = seasons.value;
    if (season === "All Seasons") {
      episodesSelect.innerHTML = "<option selected>All Episodes</option>";
      show(data);
    } else {
      episodes = data.filter((el) => el.season == season);
      episodesSelect.innerHTML = "<option selected>All Episodes</option>";
      // creat options for episodes
      for (let episode of episodes) {
        const opt = document.createElement("option");
        const episodeNumber = Number(episode.number).toLocaleString("en-US", {
          minimumIntegerDigits: 2,
        });
        opt.innerText = `${episodeNumber} - ${episode.name}`;
        opt.value = episode.name;
        episodesSelect.append(opt);
      }
      filteredData = data.filter((el) => el.season == season);
      show(filteredData);
    }

    episodesSelect.addEventListener("change", () => {
      episode = episodesSelect.value;
      if (episode === "All Episodes") show(filteredData);
      else {
        let singleEpisode = data.filter(
          (el) => el.season == season && el.name == episode
        );
        show(singleEpisode);
      }
    });
  });
}

function search(data) {
  const inputSearch = document.querySelector("#search");
  const numberOfResults = document.querySelector("#numberOfResults");

  inputSearch.addEventListener("input", () => {
    let newData = data.filter(
      (el) =>
        el.name.toLowerCase().includes(inputSearch.value) ||
        el.summary.toLowerCase().includes(inputSearch.value)
    );

    if (inputSearch.value === "") numberOfResults.innerHTML = "";
    else numberOfResults.innerHTML = `${newData.length} results`;

    show(newData);
  });
}

// control ↑ button
const btnTop = document.querySelector("#top");
window.onscroll = function () {
  if (document.documentElement.scrollTop > 20) {
    btnTop.style.display = "block";
  } else {
    btnTop.style.display = "none";
  }
};
