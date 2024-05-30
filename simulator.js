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
}
const param = ["Vo", "Da", "Vi"];

function update_inc() {
    const elm = document.querySelector("#schedule").querySelectorAll(".tr:not(.h)")

    elm.forEach((elm) => {
        elm_base = elm.querySelector(".base .checked")
        if (elm_base) {
            const base_v = parseInt(elm_base.textContent)
            let inc = { "Vo": base_v, "Da": base_v, "Vi": base_v, }
            const bonus = config_bonus[elm_base.dataset.bonus]
            if (bonus.includes(str.lesson_bonus)) {
                const row = document.querySelector(`.${str.lesson_bonus}`);
                param.forEach(p => {
                    let b = row.querySelector(`input.${p}`).value
                    b = b ? b : "0";
                    inc[p] = Math.floor(inc[p] * (100 + parseFloat(b)) / 100)
                })
            }
            if (bonus.includes(str.lesson_fix_inc)) {
                const row = document.querySelector(`.${str.lesson_fix_inc}`);
                param.forEach(p => {
                    let b = row.querySelector(`input.${p}`).value
                    b = b ? b : "0";
                    inc[p] += parseInt(b)
                })

            }
            if (bonus.includes(str.lesson_sp_fix_inc)) {
                const row = document.querySelector(`.${str.lesson_sp_fix_inc}`);
                param.forEach(p => {
                    let b = row.querySelector(`input.${p}`).value
                    b = b ? b : "0";
                    inc[p] += parseInt(b)
                })

            }
            param.forEach(p => {
                elm_s = elm.querySelector(`.inc>.${p}`)
                if (elm_s) {
                    elm_s.textContent = inc[p]
                }

            })
        }




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
            const c = tr.querySelector(`.inc>.checked.${p}`)
            sum[p] += c ? c.textContent ? parseInt(c.textContent) : 0 : 0
            const i = tr.querySelector(`.Others>.${p}`)
            sum[p] += i ? i.value ? parseInt(i.value) : 0 : 0
            const s = tr.querySelector(`.Sum>.${p}`)
            s.textContent = sum[p]
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
        elm.addEventListener("click", (event) => {
            event.target.parentNode.querySelectorAll(":scope>.radio").forEach(elm => {
                elm.classList.remove("checked")
            })
            event.target.classList.add("checked")
            update_table()
        })
    })

    document.querySelectorAll(".Others>input").forEach(elm => {
        elm.addEventListener("change", update_sum)
    })

    update_table()
}
