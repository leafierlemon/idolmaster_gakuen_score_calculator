const str = {
    "initial_param": "initial_param",
    "lesson_bonus": "lesson_bonus",
    "lesson_fix_inc": "lesson_fix_inc",
    "lesson_sp_fix_inc": "lesson_sp_fix_inc",
}
const config_bonus = {
    "fix": [],
    "lesson": [str.lesson_bonus, str.lesson_fix_inc],
    "lesson_sp": [str.lesson_bonus, str.lesson_fix_inc, str.lesson_sp_fix_inc],
    "lesson_bonus": [str.lesson_bonus],
}
const param = ["Vo", "Da", "Vi"];

function update_inc() {
    const elm = document.querySelector("#schedule").querySelectorAll(".tr:not(.h)")

    elm.forEach((elm) => {
        let elm_bases = elm.querySelectorAll(".base>*")
        let elm_incs = elm.querySelectorAll(".inc>*")
        const flg_int = (1 == elm_bases.length)
        elm_bases.forEach((elm_base, num) => {
            elm_base = elm_base.querySelector(".checked")
            if (!elm_base) return;

            // 上昇量ベースを取得
            let base_v = elm_base.classList.contains("custom_base")?parseInt(elm_base.value):parseInt(elm_base.textContent)
            if(!base_v){
                base_v=0
            }

            // 
            let inc = { "Vo": base_v, "Da": base_v, "Vi": base_v, }
            const bonus = config_bonus[elm_base.dataset.bonus]

            // レッスンボーナス
            if (bonus.includes(str.lesson_bonus)) {
                const row = document.querySelector(`.${str.lesson_bonus}`);
                param.forEach(p => {
                    let b = row.querySelector(`input.${p}`).value
                    b = b ? b : "0";
                    // inc[p] = Math.floor(inc[p] * (100 + parseFloat(b)) / 100)
                    inc[p] = inc[p] * (100 + parseFloat(b)) / 100
                })
            }
            // レッスン終了時上昇
            if (bonus.includes(str.lesson_fix_inc)) {
                const row = document.querySelector(`.${str.lesson_fix_inc}`);
                param.forEach(p => {
                    let b = row.querySelector(`input.${p}`).value
                    b = b ? b : "0";
                    inc[p] += parseInt(b)
                })

            }
            // SPレッスン終了時上昇
            if (bonus.includes(str.lesson_sp_fix_inc)) {
                const row = document.querySelector(`.${str.lesson_sp_fix_inc}`);
                param.forEach(p => {
                    let b = row.querySelector(`input.${p}`).value
                    b = b ? b : "0";
                    inc[p] += parseInt(b)
                })

            }

            param.forEach(p => {
                const elm_s = elm_incs[num].querySelector(`:scope>.${p}`)
                if (!elm_s) return;
                elm_s.textContent = flg_int ? Math.floor(inc[p]) : inc[p]

            })

        })

    })
}
function update_sum() {
    const elm = document.querySelector("#schedule").querySelectorAll(".tr:not(.h)")
    let sum = {
        "Vo": 0,
        "Da": 0,
        "Vi": 0,
    }
    // 初期パラメータの取得
    const row = document.querySelector(`.${str.initial_param}`);
    param.forEach(p => {
        let i = row.querySelector(`input.${p}`).value
        i = i ? i : "0";
        sum[p] += parseInt(i)
    })

    // 加算
    elm.forEach(tr => {
        param.forEach(p => {
            const c = tr.querySelectorAll(`.inc .checked.${p}`)
            let lb = 0
            c.forEach(c => {
                lb += c.textContent ? parseFloat(c.textContent) : 0
            })
            lb = Math.floor(lb)
            const i = tr.querySelectorAll(`.Others .${p}`)
            i.forEach(i => {
                lb += i.value ? parseInt(i.value) : 0
            })
            sum[p] += lb
            const s = tr.querySelector(`.Sum .${p}`)
            if (s) {
                s.textContent = sum[p]
            }
            const sa = tr.querySelector(".SumAll>div")
            if (sa) {
                let sumAll = 0;
                param.forEach((p) => {
                    sumAll += Math.min(sa.dataset.max,sum[p])
                })
                sa.textContent =sumAll
            }
        })
    })


}

function update_table() {
    update_inc()
    update_sum()
}

window.addEventListener("load", init)

function init() {

    document.querySelectorAll(".init_in").forEach(elm => {
        elm.addEventListener("change", update_table)
    })

    document.querySelectorAll(".radio").forEach(elm => {

        elm.addEventListener("click",onchange)
        elm.addEventListener("change",onchange)
        function onchange(event) {
            event.target.parentNode.querySelectorAll(":scope>.radio").forEach(elm => {
                elm.classList.remove("checked")
            })
            event.target.classList.add("checked")
            update_table()
        }
    })

    document.querySelectorAll(".Others input").forEach(elm => {
        elm.addEventListener("change", update_sum)
    })

    update_table()
}
