"use strict";
// 設定
const cardGroup = document.querySelector(".card-group");

const searchPlace = document.querySelector(".search-place");
const searchNum = document.querySelector(".search-num");

const ticketAdd = document.querySelector(".ticketAdd");
let data;
// data
function getData() {
  const xhr = new XMLHttpRequest();
  const url = `https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json`;
  xhr.open("get", url, true);
  xhr.send();
  xhr.addEventListener("load", function () {
    if (xhr.status === 200) {
      data = JSON.parse(xhr.responseText);
      renderData(data["data"]);
      graph.dount(graph.cityNum(data["data"]));
    } else {
      console.log(`Error ${xhr.status}`);
    }
  });
}
getData();
// 渲染畫面
function renderData(data) {
  let str = "";
  data.forEach(function (item) {
    str += `<li class="card col-lg-4" data-id=${item["id"]}>
    <div class="card-img">
      <a href="#">
        <img
          src="${item["imgUrl"]}"
          alt="${item["name"]}"
        />
      </a>
      <p class="card-place">${item["area"]}</p>
      <p class="card-star">${item["rate"]}</p>
    </div>
    <div class="card-content">
      <a href="#"><h3 class="card-title">${item["name"]}</h3></a>
      <p class="card-text">${item["description"]}
      </p>
      <div class="card-info">
        <p class="card-Num">
          <span><i class="fas fa-exclamation-circle"></i></span>
          剩下最後 ${item["group"]} 組
        </p>
        <p class="card-price">
          TWD
          <span class="card-bprice">$${item["price"]}</span>
        </p>
      </div>
    </div>
  </li>`;
  });
  searchNum.innerHTML = `本次搜尋共 ${data.length} 筆資料`;
  cardGroup.innerHTML = str;
}

// 新增
ticketAdd.addEventListener("click", function (e) {
  if (e.target.value === "新增套票") {
    for (let i = 0; i < ticketAdd.length - 1; i++) {
      if (ticketAdd[i].value === "") {
        if (ticketAdd[i].placeholder === undefined) {
          alert(`請選擇景點地區`);
          return;
        } else {
          alert(ticketAdd[i].placeholder);
          return;
        }
      }
    }
    if (
      ticketAdd[1].value.slice(0, 4) !== "http" &&
      ticketAdd[1].value.slice(0, 5) !== "https"
    ) {
      alert(`圖片網址開頭為http or https`);
      return;
    } else if (!(ticketAdd[5].value >= 1) || !(ticketAdd[5].value <= 10)) {
      alert(`請輸入套票星級 1~10`);
      return;
    } else if (ticketAdd[6].value.length > 100) {
      alert(`請輸入100字以內`);
      return;
    }
    const obj = {};
    obj["id"] = data["data"].length;
    obj["name"] = ticketAdd[0].value;
    obj["imgUrl"] = ticketAdd[1].value;
    obj["area"] = ticketAdd[2].value;
    obj["description"] = ticketAdd[6].value;
    obj["group"] = parseInt(ticketAdd[4].value);
    obj["price"] = parseInt(ticketAdd[3].value);
    obj["rate"] = parseInt(ticketAdd[5].value);

    data["data"].push(obj);
    renderData(data["data"]);
    graph.dount(graph.cityNum(data["data"]));
    searchPlace.value = "全部地區";
    clearInput();
  }
});

//清除輸入框
function clearInput() {
  for (let i = 0; i < ticketAdd.length - 1; i++) {
    ticketAdd[i].value = "";
  }
}

//搜尋
searchPlace.addEventListener("change", function () {
  if (searchPlace.value === "全部地區") {
    renderData(data["data"]);
    return;
  } else {
    const newData = data["data"].filter(function (item) {
      return item["area"] === searchPlace.value;
    });
    renderData(newData);
  }
});

// 圓餅圖
const graph = {
  cityNum(data) {
    const city = new Set(data.map((item) => item["area"]));
    const cityNum = [];
    city.forEach(function (value) {
      const num = data.reduce(
        (num, item) => (value === item["area"] ? ++num : num),
        0
      );
      const arr = [];
      arr.push(value);
      arr.push(num);
      cityNum.push(arr);
    });
    return cityNum;
  },
  dount(cityNum) {
    const chart = c3.generate({
      bindto: ".dount",
      data: {
        columns: cityNum,
        type: "donut",
        colors: {
          高雄: "#E68618",
          台中: "#5151D3",
          台北: "#26C0C7",
        },
      },
      donut: {
        title: "套票地區比重",
        width: 10,
      },
      size: {
        height: 200,
        width: 200,
      },
    });
  },
};
