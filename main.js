var map = L.map('map', {
    zoom: 13,
    zoomControl: false,
});

var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

var myIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconAnchor: [23, 56],
    tooltipAnchor: [23, -28],
})

var marker = L.marker([37.40599, -122.078514], { icon: myIcon}).addTo(map);
marker.bindTooltip("Cal", {
    offset: [-23, -28],
    direction:"top"
})

window.onload = () => {
    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_z9Z6MzH2ExlzcLYZKAYLdd7B3mVQU`)
    .then((res) => {
        return res.json()
    })
    .then((res) => {
        window.addEventListener('resize', () => {
            if (window.innerWidth < 1024) {
                map.setView([res.location.lat+0.02, res.location.lng]);
            }
            else{
                map.setView([res.location.lat, res.location.lng]);
            }   
        });
        if (window.innerWidth < 1024) {
            map.setView([res.location.lat+0.02, res.location.lng]);
        }
        else{
            map.setView([res.location.lat, res.location.lng]);
        }
        marker.setLatLng([res.location.lat, res.location.lng]);
        marker.setTooltipContent(res.isp);
        var data = [res.ip, res.location.city+', '+res.location.region+' '+res.location.postalCode, "UTC "+res.location.timezone, res.isp]
        var info = document.querySelector(".info_wrapper");
        for(let i = 0; i < info.children.length; i++){
            var p = document.createElement('h2');
            p.innerText = data[i]
            info.children[i].appendChild(p)
        }
    })
    
}

const fetchIpData = (ip) => {
    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_z9Z6MzH2ExlzcLYZKAYLdd7B3mVQU&ipAddress=${ip}`)
    .then((res) => {
        return res.json()
    })
    .then((res) => {
        if (res.code != 422) {
            var mapDiv = document.getElementById('map')
            mapDiv.style.display = '';
            var error = document.getElementById('error');
            error.style.display='none';
            map.flyTo([res.location.lat, res.location.lng], 13, {
                duration: 1,
            });
            marker.setLatLng(L.latLng(res.location.lat, res.location.lng));
            marker.setTooltipContent(res.isp);
            var data = [res.ip, res.location.city+', '+res.location.region+' '+res.location.postalCode, "UTC "+res.location.timezone, res.isp]
            var info = document.querySelector(".info_wrapper");
            for(let i = 0; i < info.children.length; i++){
                var len = info.children[i].children.length;
                info.children[i].children[len-1].innerText = data[i];
            }
        }
        else {
            var mapDiv = document.getElementById('map');
            mapDiv.style.display = 'none';
            var error = document.getElementById('error');
            error.style.display='';
            var info = document.querySelector(".info_wrapper");
            for(let i = 0; i < info.children.length; i++){
                var len = info.children[i].children.length;
                info.children[i].children[len-1].innerText = "-";
            }
        }
    })
    
};

const form = document.querySelector("#ipsearch");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const ip = form.elements["search"].value;
    fetchIpData(ip);
});


