const streamList = document.getElementById('streamList');
const cursorLight = document.querySelector('.cursor-light');
const no_video = document.getElementById('no-video');
const actual_video = document.getElementById('actual-video');
const video = document.getElementById('video-iframe');

const stream_boilerplate = `
    <div class="stream-item" onclick="loadStream('{{URL}}')">
        <div class="stream-item-bg"></div>
        <div class="stream-content">
            <div class="stream-title">{{NAME}}</div>
            <div class="stream-info">{{INFO}}</div>
        </div>
    </div>
`;

async function addStreamItem(name, info, url) {
    const streamItem = stream_boilerplate.replace('{{NAME}}', name).replace('{{INFO}}', info).replace('{{URL}}', url);
    streamList.innerHTML += streamItem;
}

async function loadStream(url) {
    console.log(url);

    if (url === '') {
        no_video.style.display = 'block';
        actual_video.style.display = 'none';

        return;
    }

    no_video.style.display = 'none';
    actual_video.style.display = '';
    video.src = url;
}

document.addEventListener('mousemove', (e) => {
    const streamItemBgs = document.querySelectorAll('.stream-item-bg');
    
    streamItemBgs.forEach((bg) => {
        const rect = bg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        bg.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)`;
    });
});

async function loadStreams() {
    const api_url = (await (await fetch('/apiurl')).json()).apiurl;
    const stream_url = (await (await fetch('/streamurl')).json()).streamurl;
    
    const streams = (await (await fetch(api_url + "/stream/get")).json()).streams;

    streams.forEach(async (stream) => {
        const name = stream.name;
        const info = stream.description;
        const url = stream_url + '/' + stream.name;

        await addStreamItem(name, info, url);
    });
} 

document.addEventListener('DOMContentLoaded', () => {
    actual_video.style.display = 'none';
    loadStreams();
});
