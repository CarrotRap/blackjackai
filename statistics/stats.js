import {Game} from '../game.js'
const start_bet = 1
function batch() {
    let wallet = 0
    let j=0
    let loose = true
    while(loose) {
        const game = new Game(start_bet*(2**j))
        let win = game.play()
        wallet += win

        if(win > 0) {
            loose=false
        }
        j=j+1
    }
    return [wallet,j]
}
const N_limit = 100000000
const wins = []
const steps = []
let old_time = 0
function loop(t) {
    if(wins.length < N_limit) {
        for (let i = 0; i < 1000; i++) {
            const [w,j] = batch()
            wins.push(w)
            steps.push(j)
        }

        if(t - old_time > 250) {
            let step_max = 0
            for (let j of steps) {if(j>step_max) {step_max=j}}

            const count_steps = []
            for (let i = 0; i<step_max; i++) {count_steps.push(0)}
            for(let j of steps) {
                count_steps[j-1]+=1
            }
            for (let i in count_steps) {
                count_steps[i] = count_steps[i]/steps.length
            }
            let win_mean = 0
            let step_mean = 0
            for(let i = 0; i < wins.length; i++) {
                win_mean+=wins[i]
                step_mean+=steps[i]
            }
            win_mean=win_mean/wins.length
            step_mean=step_mean/steps.length

            const labels = []
            for (let i = 0; i < count_steps.length; i++) {
                labels.push((i+1).toString())
            }

            chart.data.datasets[0].data= count_steps
            chart.data.labels = labels
            barr.data.datasets[0].data = [win_mean, step_mean]
            chart.update()
            barr.update()
            old_time = t
        }


        requestAnimationFrame(loop)
    }
}


// Graphique linéaire
const ctxLine = document.getElementById('lineChart').getContext('2d');
const chart = new Chart(ctxLine, {
    type: 'line',
    data: {
    labels: [1],
    datasets: [{
        label: "Probabilité d'avoir x étapes",
        data: [1],
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        fill: true,
        tension: 0.3
    }]
    },
    options: {
    responsive: true,
    scales: {
        y: { beginAtZero: true }
    },
    plugins: {
        tooltip: {
        callbacks: {
            label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${value.toFixed(10)}`; // 👈 Choisis ici le nombre de décimales
            }
        }
        }
    }
    }
});

// Graphique en barres
const ctxBar = document.getElementById('barChart').getContext('2d');
const barr = new Chart(ctxBar, {
    type: 'bar',
    data: {
    labels: ['Gain (peu fiable car long terme)', 'Etapes (fiable)'],
    datasets: [{
        label: 'Moyennes',
        data: [15, 10],
        backgroundColor: [
        'rgb(34,197,94)',
        'rgb(234,179,8)',
        'rgb(239,68,68)',
        'rgb(59,130,246)'
        ]
    }]
    },
    options: {
    responsive: true,
    scales: {
        y: { beginAtZero: true }
    }
    }
});

loop()