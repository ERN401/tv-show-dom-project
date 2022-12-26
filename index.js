const fetchAPI = async () => {
  try {
    const res = await fetch("data.json");
    const data = await res.json();
    main(data);
    console.log(data);
  } catch (err) {
    console.log("something went wrong", err);
  }
};
fetchAPI();

function main(data) {
  show(data);
  const seasons = document.querySelector("#season");
  const episodes = document.querySelector("#episode");
  const inputSearch = document.querySelector("#search");
  const numberOfResults = document.querySelector("#numberOfResults");

  //create options for seasons
  let numberOfSeasons = data[data.length - 1].season;
  for (let i = 1; i <= numberOfSeasons; i++) {
    const opt = document.createElement("option");
    opt.innerText = i;
    opt.value = i;
    seasons.appendChild(opt);
  }

  let season, episode, filteredData;
  seasons.addEventListener("change", () => {
    season = seasons.value;
    if (season === "All Seasons") {
      episodes.innerHTML = "<option selected>All Episodes</option>";
      show(data);
    } else {
      episode = data.filter((el) => el.season == season).length;
      episodes.innerHTML = "<option selected>All Episodes</option>";
      for (let i = 1; i <= episode; i++) {
        const opt = document.createElement("option");
        opt.innerText = i;
        opt.value = i;
        episodes.append(opt);
      }
      filteredData = data.filter((el) => el.season == season);
      show(filteredData);
    }

    episodes.addEventListener("change", () => {
      episode = episodes.value;
      if (episode === "All Episodes") show(filteredData);
      else {
        let singleEpisode = data.filter(
          (el) => el.season == season && el.number == episode
        );
        show(singleEpisode);
      }
    });
  });

  inputSearch.addEventListener("input", () => {
    let newData = data.filter(
      (el) =>
        el.name.includes(inputSearch.value) ||
        el.summary.includes(inputSearch.value)
    );
    numberOfResults.innerHTML = `${newData.length} results`;
    show(newData);
  });
}

function show(data) {
  const showEpisodes = document.querySelector("#showEpisodes");
  showEpisodes.innerHTML = "";

  for (let episode of data) {
    const div = document.createElement("div");
    const img = document.createElement("img");
    const number = document.createElement("p");
    const title = document.createElement("h3");
    const link = document.createElement("a");
    const summary = document.createElement("p");
    const rate = document.createElement("span");
    const runtime = document.createElement("span");

    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.backgroundColor = "#F6F6F5";
    div.style.margin = "10px";
    div.style.padding = "20px";
    div.style.width = "250px";
    div.style.height = "300px";

    img.src = episode.image.medium;
    div.append(img);

    const seasonNumber = Number(episode.season).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
    });
    const episodeNumber = Number(episode.number).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
    });
    number.innerText = `S${seasonNumber}E${episodeNumber}`;
    number.style.display = "flex";
    number.style.justifyContent = "space-between";
    number.style.padding = "2px";
    number.style.margin = "0";
    number.style.backgroundColor = "#6B7A83";
    number.style.color = "white";
    rate.innerText = `${episode.rating.average}`;
    rate.style.backgroundColor = "#e2b616";
    rate.style.color = "#121212";
    rate.style.padding = "0px 2px";
    rate.style.borderRadius = "2px";
    rate.style.fontWeight = "bold";
    number.insertAdjacentElement("afterbegin", rate);
    runtime.innerText = `${episode.runtime}'`;
    number.append(runtime);
    div.append(number);

    link.innerText = episode.name;
    link.href = episode.url;
    link.target = "_blank";
    link.style.textDecoration = "none";
    link.style.color = "black";
    title.append(link);
    div.append(title);

    summary.innerHTML = episode.summary;
    summary.style.margin = "0";
    div.append(summary);

    showEpisodes.append(div);
  }
}
