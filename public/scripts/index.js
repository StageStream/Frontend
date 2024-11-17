const streamList = document.getElementById('streamList');
const cursorLight = document.querySelector('.cursor-light');

const stream_boilerplate = `
    <div class="stream-item">
        <div class="stream-item-bg"></div>
        <div class="stream-content">
            <div class="stream-title">{{NAME}}</div>
            <div class="stream-info">{{INFO}}</div>
        </div>
    </div>
`;

async function addStreamItem(name, info) {
    const streamItem = stream_boilerplate.replace('{{NAME}}', name).replace('{{INFO}}', info);
    streamList.innerHTML += streamItem;
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



