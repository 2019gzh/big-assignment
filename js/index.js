import './echarts.min.js';
// 绑定元素
const index_j = document.querySelector('.index');
const location_j = document.querySelector('.location');
const cancel_j = document.querySelector('.cancel');
const search_j = document.querySelector('.search');
const location_name_j = document.querySelector('.location_name');
const condition_j = document.querySelector('.condition');
const today_j = document.querySelector('.today')
const tomorrow_j = document.querySelector('.tomorrow')
const week_condition_j = document.querySelectorAll('.week-condition');
const chart_j = document.querySelector('.chart');
const search_icon_j = document.querySelector('.icon-sousuo');
const input_j = document.querySelector('.search-input');
const items_j = document.querySelectorAll('.item');
const history_j = document.querySelector('.history');
const history_ul_j = history_j.querySelector('.items');
const top_j = document.querySelector('.top');
// 事件监听
location_j.addEventListener('click', () => {
    index_j.classList.add('close');
    search_j.classList.remove('close')
})

cancel_j.addEventListener('click', () => {
    index_j.classList.remove('close');
    search_j.classList.add('close');
})

search_icon_j.addEventListener('click', () => {
    let text = input_j.value;
    if (text) {
        index_j.classList.remove('close');
        search_j.classList.add('close');
        updateAll(text);
    }
    let child = document.createElement('li');
    child.className = 'item';
    child.innerHTML = text;
    child.onclick = () => {
        if (text) {
            index_j.classList.remove('close');
            search_j.classList.add('close');
            updateAll(text);
        }
    }
    history_ul_j.appendChild(child);
})

for (let i = 0; i < items_j.length; i++) {
    items_j[i].onclick = () => {
        let text = items_j[i].innerHTML;
        if (text) {
            index_j.classList.remove('close');
            search_j.classList.add('close');
            updateAll(text);
        }
    }
}


// 访问地址
const URL = {
    now(location) {
        return `https://www.tianqiapi.com/free/day?appid=61446395&appsecret=sYH6EX0f&city=${location}`
    },
    week(location) {
        return `https://www.tianqiapi.com/free/week?appid=61446395&appsecret=sYH6EX0f&city=${location}`
    }
}

/**
 * 使用promise封装Ajax请求
 * @param {string：url地址} url 
 * @param {string：请求类型} type 
 * @param {object：post的数据} data 
 */
function ajax(url, type = "get", data = null) {
    return new Promise((resolve) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.responseText);
            }
        }
        //启动
        xhr.open(type, url, true);
        //发送
        xhr.send(data);
    })
}

/**
 * 获取城市实况now
 * @param {string} cityName 
 */
function getcitynow(cityName) {
    return new Promise((resolve) => {
        let cityUrl = URL.now(cityName);
        ajax(cityUrl).then((res) => {
            let data = JSON.parse(res);
            resolve(data);
        })
    })
}

/**
 * 获取城市一周情况week
 * @param {string} cityName 
 */
function getcityweek(cityName) {
    return new Promise((resolve) => {
        let cityUrl = URL.week(cityName);
        ajax(cityUrl).then((res) => {
            let data = JSON.parse(res);
            let result = data.data;
            console.log(result);
            resolve(result);
        })
    })
}

function updateAll(cityName) {
    getcitynow(cityName)
        .then((res) => {
            location_name_j.innerHTML = res.city;
            condition_j.innerHTML = `<p>${res.tem}°</p><p>${res.wea}</p><p>${res.win} ${res.win_speed}</p>`;
            if(res.wea == '晴') {
                top_j.style.backgroundImage = "url('../weather-background/qing.jpg')";
            }
            else if(res.wea == '阴'){
                top_j.style.backgroundImage = "url('../weather-background/yin.jpg')";
            } 
            else if(res.wea == '多云'){
                top_j.style.backgroundImage = "url('../weather-background/yun.jpg')";
            }
            else{
                top_j.style.backgroundImage = "url('../weather-background/yu.jpg')";
            } 
        })
    getcityweek(cityName)
        .then((res) => {
            for (let i = 0; i < res.length; i++) {
                week_condition_j[i].innerHTML = `<div class="week-day">
        <p>
            ${res[i].date.slice(-5)}
        </p>
        <div class="week-temperature">
            <p>${res[i].wea}</p>
            <i class="iconfont icon-${trans(res[i].wea)}"></i>
        </div>
    </div>
    <div class="week-night">
        <i class="iconfont icon-${trans(res[i].wea)}"></i>
        <p>${res[i].wea}</p>
        <p class="wind">${res[i].win} ${res[i].win_speed}</p>
    </div>`
            };
            today_j.innerHTML = `<div class="today1">
            <p>今天</p>
            <p class="airChange">${res[0].wea}</p>
        </div>
        <div class="today2">
            <p class="temperature">${res[0].tem_day}/${res[0].tem_night}°</p>
            <i class="iconfont icon-${trans(res[0].wea)}"></i>
        </div>`;
            tomorrow_j.innerHTML = `<div class="tomorrow1">
            <p>明天</p>
            <p class="airChange">${res[1].wea}</p>
        </div>
        <div class="tomorrow2">
            <p class="temperature">${res[1].tem_day}/${res[1].tem_night}°</p>
            <i class="iconfont icon-${trans(res[1].wea)}"></i>
        </div>`;
            updateChart(res);
        })
}

function updateChart(res) {
    var myChart = echarts.init(chart_j);
    let option = {
        xAxis: {
            type: 'category',
            axisLabel: {
                textStyle: {
                    fontSize: 6
                }
            }
        },
        yAxis: {
            axisLabel: {
                textStyle: {
                    fontSize: 6
                }
            }
        },
        series: [
            {
                type: 'line',
                // 坐标原点的颜色
                itemStyle: {
                    normal: { color: "#e26e21da" }
                },
                lineStyle: {
                    normal: { width: 2, color: "#e26e21da" }
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 6
                        },
                        position: 'top'
                    }
                },
                smooth: true,
                data: [res[0].tem_day, res[1].tem_day, res[2].tem_day, res[3].tem_day, res[4].tem_day, res[5].tem_day, res[6].tem_day]
            },
            {
                type: 'line',
                // 坐标原点的颜色
                itemStyle: {
                    normal: { color: "blue" }
                },
                lineStyle: {
                    normal: { width: 2, color: "blue" }
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 6
                        },
                        position: 'top'
                    }
                },
                smooth: true,
                data: [res[0].tem_night, res[1].tem_night, res[2].tem_night, res[3].tem_night, res[4].tem_night, res[5].tem_night, res[6].tem_night]
            }
        ]
    };
    myChart.setOption(option);
}

function trans(words) {
    switch (words) {
        case '晴':
            return 'qing';
            break;
        case '阴':
            return 'yin';
            break;
        case '多云':
            return 'duoyun';
            break;
        case '小雨':
            return 'weather_rain_light_big';
            break;
        case '中雨':
            return 'zhongyu';
            break;
        case '大雨':
            return 'dayu';
            break;
        case '阵雨':
            return 'weather_thundershower_big';
            break;
        default:
            return 'qing'
    }
}