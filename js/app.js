(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    window.addEventListener("load", (function() {
        if (document.querySelector("body")) setTimeout((function() {
            document.querySelector("body").classList.add("_loaded");
        }), 200);
    }));
    if (sessionStorage.getItem("preloader")) {
        if (document.querySelector(".preloader")) document.querySelector(".preloader").classList.add("_hide");
        document.querySelector(".wrapper").classList.add("_visible");
    }
    if (sessionStorage.getItem("money")) {
        if (document.querySelector(".check")) document.querySelectorAll(".check").forEach((el => {
            el.textContent = sessionStorage.getItem("money");
        }));
    } else {
        sessionStorage.setItem("money", 1e4);
        if (document.querySelector(".check")) document.querySelectorAll(".check").forEach((el => {
            el.textContent = sessionStorage.getItem("money");
        }));
    }
    if (document.querySelector(".game")) if (+sessionStorage.getItem("money") >= 100) {
        document.querySelector(".block-bet__coins").textContent = 100;
        sessionStorage.setItem("current-bet", 100);
    } else {
        document.querySelector(".block-bet__coins").textContent = 0;
        sessionStorage.setItem("current-bet", 0);
    }
    const preloader = document.querySelector(".preloader");
    const wrapper = document.querySelector(".wrapper");
    function delete_money(count, block) {
        let money = +sessionStorage.getItem("money");
        sessionStorage.setItem("money", money - count);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.add("_delete-money")));
            document.querySelectorAll(block).forEach((el => el.textContent = sessionStorage.getItem("money")));
        }), 500);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_delete-money")));
        }), 1500);
    }
    function no_money(block) {
        document.querySelectorAll(block).forEach((el => el.classList.add("_no-money")));
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_no-money")));
        }), 1e3);
    }
    function get_random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    function add_money(count, block, delay, delay_off) {
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.textContent = +sessionStorage.getItem("money") + count));
            document.querySelectorAll(block).forEach((el => el.classList.add("_anim-add-money")));
            sessionStorage.setItem("money", +sessionStorage.getItem("money") + count);
        }), delay);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_anim-add-money")));
        }), delay_off);
    }
    let anim_items = document.querySelectorAll(".icon-anim img");
    function get_random_animate() {
        let number = get_random(0, 3);
        let arr = [ "jump", "scale", "rotate" ];
        let random_item = get_random(0, anim_items.length);
        anim_items.forEach((el => {
            if (el.classList.contains("_anim-icon-jump")) el.classList.remove("_anim-icon-jump"); else if (el.classList.contains("_anim-icon-scale")) el.classList.remove("_anim-icon-scale"); else if (el.classList.contains("_anim-icon-rotate")) el.classList.remove("_anim-icon-rotate");
        }));
        setTimeout((() => {
            anim_items[random_item].classList.add(`_anim-icon-${arr[number]}`);
        }), 100);
    }
    if (document.querySelector(".icon-anim img")) setInterval((() => {
        get_random_animate();
    }), 1e4);
    if (document.querySelector(".main__body") && document.querySelector(".preloader").classList.contains("_hide")) document.querySelector(".main__body").classList.add("_active");
    function hide_main_show_rules(block) {
        block.classList.add("_active");
        create_chip();
        setTimeout((() => {
            document.querySelector(".main__bg").classList.add("_rules");
            document.querySelector(".main__body").classList.add("_hide");
            document.querySelector(".rules").classList.add("_active");
        }), 1e3);
    }
    function create_chip() {
        let current_chip = sessionStorage.getItem("current-chip");
        let chip = document.createElement("img");
        chip.setAttribute("src", `img/icons/chip-${current_chip}.png`);
        chip.setAttribute("alt", `Icon`);
        document.querySelector(".rules__image").append(chip);
    }
    const config = {
        program: 1,
        item_left: 0,
        item_top: 0,
        cub_top: 0,
        cub_left: 0,
        height_chip: 37,
        number_cub: 0,
        current_number_dot: 1,
        current_position_dot: 1,
        current_bonus: 0,
        hold: false,
        hold_enemy: false
    };
    if (document.querySelector(".game")) create_page_status();
    const config_bot = {
        current_number_dot: 1,
        current_position_dot: 1,
        hold: false,
        hold_enemy: false
    };
    function start_game() {
        if (+sessionStorage.getItem("money") > +sessionStorage.getItem("current-bet")) {
            add_class_item(".button-balance__body", "_hold");
            move_cub();
            setTimeout((() => {
                start_move_chip();
            }), 500);
            delete_money(+sessionStorage.getItem("current-bet"), ".check");
        } else no_money(".check");
    }
    function move_cub() {
        write_value_cub();
        generate_coord_cub();
        move_cub_to_coordinate();
    }
    function generate_coord_cub() {
        config.cub_top = `${get_random(15, 55)}%`;
        config.cub_left = `${get_random(0, 75)}%`;
    }
    function move_cub_to_coordinate() {
        document.querySelector(".item-game__cub").style.top = config.cub_top;
        document.querySelector(".item-game__cub").style.left = config.cub_left;
        document.querySelector(".item-game__cub").style.transform = "rotate(0deg)";
        setTimeout((() => {
            move_cub_to_start_coordinate();
        }), 2500);
    }
    function move_cub_to_start_coordinate() {
        document.querySelector(".item-game__cub").style.top = "0%";
        document.querySelector(".item-game__cub").style.left = "-10%";
        document.querySelector(".item-game__cub").style.transform = "rotate(-360deg)";
    }
    function write_value_cub() {
        document.querySelector(".item-game__cub img").remove();
        let image = document.createElement("img");
        config.number_cub = get_random(1, 7);
        if (1 == config.program) if (config.current_number_dot + config.number_cub > 33) config.current_number_dot = 33; else config.current_number_dot = config.current_number_dot + config.number_cub; else if (2 == config.program) if (config_bot.current_number_dot + config.number_cub > 33) config_bot.current_number_dot = 33; else config_bot.current_number_dot = config_bot.current_number_dot + config.number_cub;
        image.setAttribute("src", `img/icons/cub-${config.number_cub}.png`);
        document.querySelector(".item-game__cub").append(image);
        if (6 == config.number_cub) setTimeout((() => {
            document.querySelector(".info-game__text").textContent = "6 fell out. Plus one more move";
            show_remove_item_info();
        }), 1e3);
    }
    function start_move_chip() {
        add_class_item(".block-bet", "_hold");
        let block = "";
        if (1 == config.program) block = config; else if (2 == config.program) block = config_bot;
        if (1 == block.current_position_dot) {
            jump_chip(2);
            block.current_position_dot = 2;
            if (block.current_number_dot == block.current_position_dot) {
                check_game_over();
                return false;
            } else check_and_jump_chip();
        } else if (block.current_position_dot > 1 && block.current_position_dot < 33) {
            let number = block.current_position_dot;
            jump_chip(number + 1);
            block.current_position_dot = number + 1;
            if (block.current_number_dot == block.current_position_dot) {
                check_game_over();
                return false;
            } else check_and_jump_chip();
        }
    }
    function jump_chip(num_dot) {
        let color = "";
        if (1 == config.program) color = sessionStorage.getItem("current-chip"); else if (2 == config.program) color = sessionStorage.getItem("bots-chip");
        get_coord_block(document.querySelector(`.field__pin_${num_dot}`));
        setTimeout((() => {
            document.querySelector(`.field__chip_${color}`).style.top = `${config.item_top}px`;
            document.querySelector(`.field__chip_${color}`).style.left = `${config.item_left}px`;
            if (config.current_number_dot == config_bot.current_position_dot) {
                document.querySelector(`.field__chip_${color}`).style.top = `${config.item_top - 2}px`;
                document.querySelector(`.field__chip_${color}`).style.left = `${config.item_left + 5}px`;
            }
        }), 500);
    }
    function get_coord_block(block) {
        const element = block;
        const style = window.getComputedStyle(element);
        config.item_left = parseInt(style.left, 10) - 10;
        config.item_top = parseInt(style.top, 10) - 30;
    }
    function check_and_jump_chip() {
        let block = "";
        if (1 == config.program) block = config; else if (2 == config.program) block = config_bot;
        setTimeout((() => {
            let number = block.current_position_dot;
            jump_chip(number + 1);
            block.current_position_dot = number + 1;
            if (block.current_number_dot == block.current_position_dot) {
                setTimeout((() => {
                    check_game_over();
                }), 1e3);
                return false;
            } else return check_and_jump_chip();
        }), 1e3);
    }
    function get_trap() {
        let block = "";
        let block_2 = "";
        if (1 == config.program) {
            block = config;
            block_2 = config_bot;
        } else if (2 == config.program) {
            block = config_bot;
            block_2 = config;
        }
        block.hold = true;
        block_2.hold_enemy = true;
    }
    function check_game_over() {
        let block = "";
        if (1 == config.program) block = config; else if (2 == config.program) block = config_bot;
        let current_chip_position = block.current_number_dot;
        if (2 == current_chip_position || 3 == current_chip_position || 4 == current_chip_position || 10 == current_chip_position || 13 == current_chip_position || 15 == current_chip_position || 18 == current_chip_position || 19 == current_chip_position || 24 == current_chip_position || 26 == current_chip_position || 28 == current_chip_position || 29 == current_chip_position || 31 == current_chip_position) get_money_coeff(1 / 10); else if (5 == current_chip_position) get_money_coeff(1); else if (12 == current_chip_position) get_money_coeff(1.5); else if (16 == current_chip_position) get_money_coeff(2.2); else if (20 == current_chip_position) get_money_coeff(3.2); else if (25 == current_chip_position) get_money_coeff(3.8); else if (33 == current_chip_position) {
            get_money_coeff(50);
            if (1 == config.program) {
                get_money_coeff(50);
                document.querySelector(".win__text").textContent = config.current_bonus;
                setTimeout((() => {
                    document.querySelector(".win").classList.add("_active");
                    1 == config.program;
                }), 1500);
                return false;
            } else if (2 == config.program) {
                delete_money(config.current_bonus, ".check");
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 1500);
            }
        } else if (6 == current_chip_position || 11 == current_chip_position || 17 == current_chip_position || 22 == current_chip_position) {
            document.querySelector(".info-game__text").textContent = "You drowned. Go back to the start";
            show_remove_item_info();
            setTimeout((() => {
                block.current_number_dot = 1;
                let number = block.current_number_dot;
                jump_chip(number);
                block.current_position_dot = number;
                check_change_turn();
            }), 1e3);
        } else if (7 == current_chip_position || 21 == current_chip_position || 32 == current_chip_position) {
            document.querySelector(".info-game__text").textContent = "The enemy got into quicksand. Skipping a move";
            show_remove_item_info();
            if (1 == config.program) remove_class_item(".button-balance__body", "_hold"); else if (2 == config.program) setTimeout((() => {
                move_cub();
                setTimeout((() => {
                    start_move_chip();
                }), 500);
            }), 1e3);
        } else if (9 == current_chip_position || 23 == current_chip_position || 30 == current_chip_position) {
            document.querySelector(".info-game__text").textContent = "You have fallen into a trap. Skip the move";
            show_remove_item_info();
            get_trap();
            check_change_turn();
        } else if (8 == current_chip_position || 14 == current_chip_position || 27 == current_chip_position) {
            document.querySelector(".info-game__text").textContent = "You are entangled in the thicket, take 2 steps back";
            show_remove_item_info();
            setTimeout((() => {
                block.current_number_dot = block.current_number_dot - 2;
                let number = block.current_number_dot;
                jump_chip(number);
                block.current_position_dot = number;
                setTimeout((() => {
                    check_game_over();
                }), 1e3);
            }), 1e3);
        }
    }
    function show_remove_item_info() {
        document.querySelector(".info-game").classList.add("_active");
        setTimeout((() => {
            document.querySelector(".info-game").classList.remove("_active");
        }), 4e3);
    }
    function get_money_coeff(coeff) {
        if (1 == config.program) {
            let count = +sessionStorage.getItem("current-bet") * coeff;
            add_money(count, ".check", 1e3, 2e3);
            config.current_bonus += count;
        }
        check_change_turn();
    }
    function check_change_turn() {
        let block = "";
        if (1 == config.program) block = config; else if (2 == config.program) block = config_bot;
        if (1 == config.program) if (6 == config.number_cub && false == config.hold || config.hold_enemy) {
            setTimeout((() => {
                remove_class_item(".button-balance__body", "_hold");
            }), 2e3);
            if (config.hold_enemy) config.hold_enemy = false;
            return false;
        } else if (6 == config.number_cub && block.hold) setTimeout((() => {
            remove_class_item(".button-balance__body", "_hold");
            change_move_bot();
        }), 2e3); else setTimeout((() => {
            remove_class_item(".button-balance__body", "_hold");
            change_move_bot();
        }), 2e3); else if (2 == config.program) if (6 == config.number_cub && false == config.hold || config_bot.hold_enemy) setTimeout((() => {
            move_cub();
            setTimeout((() => {
                start_move_chip();
            }), 500);
            if (config_bot.hold_enemy) config_bot.hold_enemy = false;
        }), 1e3); else if (6 == config_bot.number_cub && config_bot.hold) setTimeout((() => {
            change_move_player();
        }), 1e3); else setTimeout((() => {
            change_move_player();
        }), 1e3);
    }
    function change_move_bot() {
        if (33 == config.current_number_dot) return false;
        config.program = 2;
        create_page_status();
        write_snake_button();
        setTimeout((() => {
            move_cub();
        }), 1500);
        setTimeout((() => {
            start_move_chip();
        }), 2500);
    }
    function change_move_player() {
        config.program = 1;
        create_page_status();
        write_snake_button();
    }
    function create_page_status() {
        if (document.querySelector(".chip-game__circle img")) document.querySelector(".chip-game__circle img").remove();
        let image = document.createElement("img");
        if (1 == config.program) {
            image.setAttribute("src", `img/icons/chip-${sessionStorage.getItem("current-chip")}.png`);
            document.querySelector(".chip-game__info").textContent = "You’r move";
            write_snake_button();
        } else if (2 == config.program) {
            image.setAttribute("src", `img/icons/chip-${sessionStorage.getItem("bots-chip")}.png`);
            document.querySelector(".chip-game__info").textContent = "Bot’s move";
            write_snake_button();
        }
        document.querySelector(".chip-game__circle").append(image);
    }
    function write_snake_button() {
        if (1 == config.program) {
            if (document.querySelector(".button-balance__body").classList.contains("_bot")) document.querySelector(".button-balance__body").classList.remove("_bot");
        } else if (2 == config.program) document.querySelector(".button-balance__body").classList.add("_bot");
    }
    function add_class_item(item, className) {
        document.querySelector(item).classList.add(className);
    }
    function remove_class_item(item, className) {
        if (document.querySelector(item).classList.contains(className)) document.querySelector(item).classList.remove(className);
    }
    function reset_current_actions() {
        config.current_number_dot = 1;
        config.current_position_dot = 1;
        config_bot.current_number_dot = 1;
        config_bot.current_position_dot = 1;
        config.current_bonus = 0;
        document.querySelector(".field__chip_green").style.left = "72px";
        document.querySelector(".field__chip_green").style.bottom = "20px";
        document.querySelector(".field__chip_blue").style.left = "52px";
        document.querySelector(".field__chip_blue").style.bottom = "20px";
        if (document.querySelector(".win").classList.contains("_active")) document.querySelector(".win").classList.remove("_active"); else document.querySelector(".loose").classList.remove("_active");
    }
    document.addEventListener("click", (e => {
        let targetElement = e.target;
        if (targetElement.closest(".preloader__button")) {
            sessionStorage.setItem("preloader", true);
            preloader.classList.add("_hide");
            wrapper.classList.add("_visible");
            if (document.querySelector(".main__body") && document.querySelector(".preloader").classList.contains("_hide")) document.querySelector(".main__body").classList.add("_active");
        }
        if (targetElement.closest(".block-bet__minus")) {
            let current_bet = +sessionStorage.getItem("current-bet");
            if (current_bet >= 50) {
                sessionStorage.setItem("current-bet", current_bet - 50);
                document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
            }
        }
        if (targetElement.closest(".block-bet__plus")) {
            let current_bet = +sessionStorage.getItem("current-bet");
            let current_bank = +sessionStorage.getItem("money");
            if (current_bank - 49 > current_bet) {
                sessionStorage.setItem("current-bet", current_bet + 50);
                document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
            } else no_money(".check");
        }
        if (targetElement.closest(".chips-main__button-blue")) {
            sessionStorage.setItem("current-chip", "blue");
            sessionStorage.setItem("bots-chip", "green");
            hide_main_show_rules(targetElement.closest(".chips-main__item"));
        }
        if (targetElement.closest(".chips-main__button-green")) {
            sessionStorage.setItem("current-chip", "green");
            sessionStorage.setItem("bots-chip", "blue");
            hide_main_show_rules(targetElement.closest(".chips-main__item"));
        }
        if (targetElement.closest(".button-balance__body")) start_game();
        if (targetElement.closest(".win__button") || targetElement.closest(".loose__button")) reset_current_actions();
    }));
    window["FLS"] = true;
    isWebp();
})();